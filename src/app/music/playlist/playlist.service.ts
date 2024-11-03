import { 
    Injectable, 
    NotFoundException, 
    ForbiddenException,
    BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddMusicToPlaylistDto } from './dto/add-music-to-playlist.dto';
import { MusicEntity } from 'src/database/entities/music/music.entity';
import { PlayListEntity } from 'src/database/entities/music/playlist.entity';
import { PlayListMusicEntity } from 'src/database/entities/music/playlistmusic.entity';

@Injectable()
export class PlaylistService {
    constructor(
        @InjectRepository(PlayListEntity)
        private readonly playlistRepo: Repository<PlayListEntity>,

        @InjectRepository(MusicEntity)
        private readonly musicRepo: Repository<MusicEntity>,

        @InjectRepository(PlayListMusicEntity)
        private readonly playlistMusicRepo: Repository<PlayListMusicEntity>,
    ) {}

    async createPlaylist(dto: CreatePlaylistDto, userId: number): Promise<PlayListEntity> {
        const playlist = this.playlistRepo.create({
            ...dto,
            creator: { id: userId }
        });
        return await this.playlistRepo.save(playlist);
    }

    async findOnePlaylist(id: number, userId: number): Promise<PlayListEntity> {
        const playlist = await this.playlistRepo.findOne({
            where: { id },
            relations: ['creator', 'musicTracks', 'musicTracks.music']
        });

        if (!playlist) {
            throw new NotFoundException('Playlist not found');
        }

        return playlist;
    }

    async updatePlaylist(playlistId: number, dto: UpdatePlaylistDto, userId: number): Promise<PlayListEntity> {
        const playlist = await this.playlistRepo.findOne({
            where: { id: playlistId },
            relations: ['musicTracks', 'musicTracks.music', 'creator']
        });
    
        if (!playlist) {
            throw new NotFoundException('Playlist not found');
        }
    
        if (playlist.creator.id !== userId) {
            throw new ForbiddenException('You are not authorized to update this playlist');
        }
    
        return await this.playlistRepo.manager.transaction(async (transactionalEntityManager) => {
            if (dto.title) playlist.title = dto.title;
            if (dto.description) playlist.description = dto.description;
    
            if (dto.tracks) {
                const trackUpdates = new Map(dto.tracks.map(t => [t.musicId, t.order]));
                
                const validTracks = playlist.musicTracks.filter(track => 
                    trackUpdates.has(track.music.id)
                );
    
                validTracks.forEach(track => {
                    const requestedOrder = trackUpdates.get(track.music.id);
                    if (requestedOrder !== undefined) {
                        track.order = requestedOrder;
                    }
                });
    
                playlist.musicTracks.sort((a, b) => a.order - b.order);
                playlist.musicTracks.forEach((track, index) => {
                    track.order = index + 1;
                });
    
                await Promise.all(
                    playlist.musicTracks.map(track => 
                        transactionalEntityManager.save(PlayListMusicEntity, track)
                    )
                );
            }
    
            return await transactionalEntityManager.save(PlayListEntity, playlist);
        });
    }

    async deletePlaylist(playlistId: number, userId: number): Promise<void> {
        const playlist = await this.playlistRepo.findOne({
            where: { id: playlistId },
            relations: ['creator']
        });

        if (!playlist) {
            throw new NotFoundException('Playlist not found');
        }

        if (playlist.creator.id !== userId) {
            throw new ForbiddenException('You are not authorized to delete this playlist');
        }

        await this.playlistRepo.remove(playlist);
    }

    async addMusicToPlaylist(dto: AddMusicToPlaylistDto, userId: number): Promise<PlayListEntity> {
        const playlist = await this.playlistRepo.findOne({
            where: { id: dto.playlistId },
            relations: ['creator', 'musicTracks', 'musicTracks.music']
        });

        if (!playlist) {
            throw new NotFoundException('Playlist not found');
        }

        if (playlist.creator.id !== userId) {
            throw new ForbiddenException('You are not authorized to modify this playlist');
        }

        const music = await this.musicRepo.findOne({
            where: { id: dto.musicId }
        });

        if (!music) {
            throw new NotFoundException('Music not found');
        }

        const existingTrack = playlist.musicTracks.find(track => track.music.id === dto.musicId);
        if (existingTrack) {
            throw new BadRequestException('This music track is already in the playlist');
        }

        return await this.playlistRepo.manager.transaction(async (transactionalEntityManager) => {
            const newTrack = this.playlistMusicRepo.create({
                playlist,
                music,
                order: playlist.musicTracks.length + 1
            });

            await transactionalEntityManager.save(PlayListMusicEntity, newTrack);
            playlist.musicTracks.push(newTrack);

            return await transactionalEntityManager.save(PlayListEntity, playlist);
        });
    }

    async removeMusicFromPlaylist(playlistId: number, musicId: number, userId: number): Promise<PlayListEntity> {
        const playlist = await this.playlistRepo.findOne({
            where: { id: playlistId },
            relations: ['creator', 'musicTracks', 'musicTracks.music']
        });

        if (!playlist) {
            throw new NotFoundException('Playlist not found');
        }

        if (playlist.creator.id !== userId) {
            throw new ForbiddenException('You are not authorized to modify this playlist');
        }

        const musicTrack = playlist.musicTracks.find(track => track.music.id === musicId);
        if (!musicTrack) {
            throw new NotFoundException('Music not found in this playlist');
        }

        return await this.playlistRepo.manager.transaction(async (transactionalEntityManager) => {
            playlist.musicTracks = playlist.musicTracks.filter(track => track.music.id !== musicId);
            
            playlist.musicTracks.forEach((track, index) => {
                track.order = index + 1;
            });

            await transactionalEntityManager.delete(PlayListMusicEntity, {
                playlist: { id: playlistId },
                music: { id: musicId }
            });

            await transactionalEntityManager.save(PlayListMusicEntity, playlist.musicTracks);
            return await transactionalEntityManager.save(PlayListEntity, playlist);
        });
    }
}