import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString, Length, Max, maxDate, Min, MinLength } from "class-validator"

export class SearchUserDto {
    @Type()
    @ApiProperty()
    @IsString()
    @MinLength(1)
    searchParam: string

    @Type()
    @ApiProperty({required:false})
    @IsOptional()    
    @IsNumber()
    @Min(0)
    @Max(200)
    limit: number

    @Type()
    @ApiProperty({required:false})
    @IsOptional()
    @IsNumber()
    @Min(0)
    page: number
}