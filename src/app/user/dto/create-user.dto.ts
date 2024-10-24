import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsDate, IsEmail, IsEnum, IsString, Length, MaxDate, MinDate } from "class-validator"
import * as dateFns from 'date-fns'
import { UserRoles } from "src/shared/enums/user.enum"

export class CreateUserDto {
    @Type()
    @IsString()
    @ApiProperty()
    @Length(3, 100)
    userName: string

    @Type()
    @IsEmail()
    @ApiProperty()
    @Length(4, 150)
    email: string

    @Type()
    @IsString()
    @ApiProperty()
    @Length(5, 200)
    password: string

    @Type()
    @IsDate()
    @ApiProperty()
    @MaxDate(() => dateFns.add(new Date(), { years: -6 }), { message: 'Too young' })
    @MinDate(() => dateFns.add(new Date(), { years: -200 }), { message: 'No one that old!!!' })
    birthDate: Date

    @Type()
    @IsEnum(UserRoles)
    @ApiProperty({ default: UserRoles.USER, isArray: false })
    role: UserRoles
}