import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsNumber, IsOptional, IsString } from "class-validator";


export class EditMusicDto{
    @Type(() => String)
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    title?: string;

    @Type(() => Number)
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    uploadId?: number;

    @Type(() => Number)
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    imageId?: number;

    @Type()
    @ApiProperty({ isArray: true, type: Number })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    genreId?: number[];

    @Type()
    @ApiProperty({ isArray: true, type: Number })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    playlistId?: number[]
}
