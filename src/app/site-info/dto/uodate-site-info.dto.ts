import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateSiteInfoDto {
    @Type()
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    logoId?: number;

    @Type()
    @ApiProperty()
    @IsOptional()
    @IsString()
    siteName?: string;

    @Type()
    @ApiProperty()
    @IsOptional()
    @IsString()
    aboutUs?: string;

    @Type()
    @ApiProperty()
    @IsOptional()
    @IsString()
    contact?: string;

    @Type()
    @ApiProperty()
    @IsOptional()
    @IsString()
    phone?: string;

    @Type()
    @ApiProperty()
    @IsOptional()
    @IsString()
    email?: string;
}
