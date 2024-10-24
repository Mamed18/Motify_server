import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.servive";
import { RegisterDto } from "./dto/register.dto";
import { LogInDto } from "./dto/login.dto";

@Controller('auth')
@ApiTags('Auth')
export class AuthController{
    constructor( private authService: AuthService){}

    @Post('register')
    register(@Body() body: RegisterDto){
        return this.authService.register(body)
    }

    @Post('login')
    logIn(@Body() body: LogInDto){
        return this.authService.logIn(body)
    }
}