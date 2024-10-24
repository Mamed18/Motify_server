import { Body, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { RegisterDto } from "./dto/register.dto";
import { JwtService } from "@nestjs/jwt";
import { LogInDto } from "./dto/login.dto";
import * as bcrypt from 'bcrypt'
import { UserRoles } from "src/shared/enums/user.enum";
import { MailerService } from "@nestjs-modules/mailer";
import config from "src/config";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private mailerService: MailerService,
    ) { }

    async register(@Body() body: RegisterDto) {
        let user = await this.userService.create({ ...body, role: UserRoles.USER })
        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Welcome to Motify',
                template: 'welcome',
                context: {
                    userName: user.userName,
                }
            })
        } catch (error) {
            console.log('Error sending email', error)
        }

        return this;
    }

    async logIn(@Body() body: LogInDto) {
        let user = await this.userService.findOne([{ userName: body.userName }, { email: body.userName }])
        if (!user) {
            throw new HttpException('Username, email or password is incorrect', HttpStatus.BAD_REQUEST)
        }

        let passwordChecker = await bcrypt.compare(body.password, user.password)
        if (!passwordChecker) {
            throw new HttpException('Username, email or password is incorrect', HttpStatus.BAD_REQUEST)
        }

        let payload = {
            userId: user.id
        }

        let token = this.jwtService.sign(payload)
        return { token, user, }
    }


}