import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class FollowDto{
    @Type()
    @ApiProperty()
    @IsNumber()
    id: number
}