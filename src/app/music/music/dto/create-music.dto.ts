import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMusicDto {
    @Type()
    @ApiProperty()
    @IsString()
    title: string

    @Type()
    @ApiProperty()
    @IsNumber()
    uploadId: number

    @Type()
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    imageId: number

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