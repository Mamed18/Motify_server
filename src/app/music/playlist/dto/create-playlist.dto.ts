import { IsNotEmpty, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlaylistDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    @ApiProperty({ description: 'Title of the playlist' })
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    @ApiPropertyOptional({ description: 'Description of the playlist' })
    description?: string;
}