import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateGenreDto {
    @IsString()
    @IsOptional()
    @ApiProperty()
    name?: string;
}