import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/app/user/user.service";
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from 'src/shared/enums/user.enum';
import { ClsService } from "nestjs-cls";

@Injectable()
export class AuthRolesGuard implements CanActivate {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private reflector: Reflector,
        private cls: ClsService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        let token = request.headers.authorization || '';
        token = token.split(' ')[1]

        if (!token) throw new UnauthorizedException();

        try {
            let payload = this.jwtService.verify(token)
            if (!payload.userId) throw new Error()

            let user = await this.userService.findOne({ id: payload.userId })
            if (!user) throw new Error();

            this.cls.set('user', user)

            const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);

            if (!requiredRoles) {
                return true;
            }

            if (!user.role || !requiredRoles.includes(user.role)) {
                throw new UnauthorizedException('Insufficient permissions');
            }

        } catch (error) {
            throw new UnauthorizedException(error.message || 'Unauthorized');
        }

        return true;
    }
}