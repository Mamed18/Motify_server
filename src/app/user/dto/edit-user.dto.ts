import { ApiPropertyOptional, OmitType } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsString, Length, IsDate, MaxDate, MinDate, IsEnum, IsOptional, IsNumber, IsBoolean } from "class-validator"
import { UserRoles } from "src/shared/enums/user.enum"
import * as dateFns from 'date-fns'

export class EditUserDto {
    @Type()
    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    @Length(3, 100)
    userName: string

    @IsOptional()
    @IsString()
    @Length(0, 50)
    @ApiPropertyOptional()
    firstName: string;

    @IsOptional()
    @IsString()
    @Length(0, 50)
    @ApiPropertyOptional()
    lastName: string;

    @IsOptional()
    @IsString()
    @Length(0, 1000)
    @ApiPropertyOptional()
    bio: string;

    @Type()
    @IsDate()
    @IsOptional()
    @ApiPropertyOptional()
    @MaxDate(() => dateFns.add(new Date(), { years: -6 }), { message: 'Too young' })
    @MinDate(() => dateFns.add(new Date(), { years: -200 }), { message: 'No one that old!!!' })
    birthDate: Date

    @Type()
    @IsEnum(UserRoles)
    @IsOptional()
    @ApiPropertyOptional({ default: UserRoles.USER, isArray: false })
    role: UserRoles

    @Type()
    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional()
    profilePictureId: number

    @Type()
    @IsBoolean()
    @IsOptional()
    @ApiPropertyOptional({ required: false, default: false })
    isPrivate: boolean;
}

export class EditProfileDto {
    @Type()
    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    @Length(3, 100)
    userName: string

    @IsOptional()
    @IsString()
    @Length(0, 50)
    @ApiPropertyOptional()
    firstName: string;

    @IsOptional()
    @IsString()
    @Length(0, 50)
    @ApiPropertyOptional()
    lastName: string;

    @IsOptional()
    @IsString()
    @Length(0, 1000)
    @ApiPropertyOptional()
    bio: string;

    @Type()
    @IsDate()
    @IsOptional()
    @ApiPropertyOptional()
    @MaxDate(() => dateFns.add(new Date(), { years: -6 }), { message: 'Too young' })
    @MinDate(() => dateFns.add(new Date(), { years: -200 }), { message: 'No one that old!!!' })
    birthDate: Date

    @Type()
    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional()
    profilePictureId: number

    @Type()
    @IsBoolean()
    @IsOptional()
    @ApiPropertyOptional({ required: false, default: false })
    isPrivate: boolean;
}