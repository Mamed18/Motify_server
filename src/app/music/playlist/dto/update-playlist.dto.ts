import { IsArray, IsInt, IsOptional, IsString, ValidateNested, Min, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class TrackOrder {
    @IsInt()
    @ApiProperty({ description: 'ID of the music track' })
    musicId: number;

    @IsInt()
    @Min(1)
    @ApiProperty({ description: 'Order of the music track in the playlist' })
    order: number;
}

export class UpdatePlaylistDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    @ApiPropertyOptional({ description: 'New title of the playlist' })
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    @ApiPropertyOptional({ description: 'New description of the playlist' })
    description?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TrackOrder)
    @ApiPropertyOptional({ type: [TrackOrder], description: 'Tracks to reorder in the playlist' })
    tracks?: TrackOrder[];
}