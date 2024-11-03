import { 
    Controller, 
    Post, 
    Get,
    Patch, 
    Delete, 
    Param, 
    Body, 
    UseGuards,
    ParseIntPipe,
    NotFoundException
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import { AuthRolesGuard } from "src/guards/auth-roles.guard";
import { PlaylistService } from "./playlist.service";
import { CreatePlaylistDto } from "./dto/create-playlist.dto";
import { UpdatePlaylistDto } from "./dto/update-playlist.dto";
import { AddMusicToPlaylistDto } from "./dto/add-music-to-playlist.dto";
import { PlayListEntity } from "src/database/entities/music/playlist.entity";
import { ClsService } from 'nestjs-cls';

@Controller('playlists')
@ApiTags('Playlists')
@ApiBearerAuth()
@UseGuards(AuthRolesGuard)
export class PlaylistController {
    constructor(
        private readonly playlistService: PlaylistService,
        private readonly cls: ClsService,
    ) {}

    @Post()
    async create(@Body() dto: CreatePlaylistDto): Promise<PlayListEntity> {
        const user = this.cls.get<{ id: number }>('user');
        return this.playlistService.createPlaylist(dto, user.id);
    }


    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const user = this.cls.get<{ id: number }>('user');
        const playlist = await this.playlistService.findOnePlaylist(id, user.id);
        if (!playlist) {
            throw new NotFoundException('Playlist not found');
        }
        return playlist;
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdatePlaylistDto,
    ): Promise<PlayListEntity> {
        const user = this.cls.get<{ id: number }>('user');
        return this.playlistService.updatePlaylist(id, dto, user.id);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        const user = this.cls.get<{ id: number }>('user');
        return this.playlistService.deletePlaylist(id, user.id);
    }

    @Post(':playlistId/tracks/:musicId') // Changed to 'tracks' for consistency
    async addTrackToPlaylist(
        @Param('playlistId', ParseIntPipe) playlistId: number,
        @Param('musicId', ParseIntPipe) musicId: number,
    ) {
        const user = this.cls.get<{ id: number }>('user');
        const dto: AddMusicToPlaylistDto = { playlistId, musicId };
        return this.playlistService.addMusicToPlaylist(dto, user.id);
    }

    @Delete(':playlistId/tracks/:musicId')
    async removeTrackFromPlaylist(
        @Param('playlistId', ParseIntPipe) playlistId: number,
        @Param('musicId', ParseIntPipe) musicId: number,
    ) {
        const user = this.cls.get<{ id: number }>('user');
        return this.playlistService.removeMusicFromPlaylist(playlistId, musicId, user.id);
    }
}