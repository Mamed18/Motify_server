import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthRolesGuard } from "src/guards/auth-roles.guard";
import { MusicService } from "./music.service";
import { MusicEntity } from "src/database/entities/music/music.entity";
import { CreateMusicDto } from "./dto/create-music.dto";
import { EditMusicDto } from "./dto/edit-music.dto";

@Controller('music')
@ApiTags('Music')
@ApiBearerAuth()
@UseGuards(AuthRolesGuard)
export class MusicController{
    constructor(
        private musicService: MusicService
    ){}

    @Post()
    async create(@Body() body: CreateMusicDto): Promise<MusicEntity> {
        return this.musicService.create(body);
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<MusicEntity> {
        return this.musicService.findOne({ id });
    }

    @Put(':id')
    async edit(
        @Param('id') id: number,
        @Body() body: EditMusicDto,
    ): Promise<MusicEntity> {
        return this.musicService.edit(id, body);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<MusicEntity> {
        return this.musicService.delete(id);
    }
}