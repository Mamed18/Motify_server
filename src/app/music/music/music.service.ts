import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MusicEntity } from "src/database/entities/music/music.entity";
import { FindOptionsWhere, Repository, In } from "typeorm";
import { CreateMusicDto } from "./dto/create-music.dto";
import { ClsService } from "nestjs-cls";
import { UploadEntity } from "src/database/entities/upload.entity";
import { GenreEntity } from "src/database/entities/music/genre.entity";
import { PlayListEntity } from "src/database/entities/music/playlist.entity";
import { UserEntity } from "src/database/entities/user.entity";
import { EditMusicDto } from "./dto/edit-music.dto";
import { UserRoles } from "src/shared/enums/user.enum";
import { UploadType } from "src/shared/enums/upload.enum";

@Injectable()
export class MusicService {
    constructor(
        @InjectRepository(MusicEntity)
        private musicRepo: Repository<MusicEntity>,

        @InjectRepository(UploadEntity)
        private uploadRepo: Repository<UploadEntity>,

        @InjectRepository(GenreEntity)
        private genreRepo: Repository<GenreEntity>,

        @InjectRepository(PlayListEntity)
        private playlistRepo: Repository<PlayListEntity>,

        private cls: ClsService,
    ) {}

    async findOne(where: FindOptionsWhere<MusicEntity> | FindOptionsWhere<MusicEntity>[]) {
        const music = await this.musicRepo.findOne({ where, relations: ['author', 'upload', 'image', 'genre', 'playList'] });
        if (!music) throw new NotFoundException('Music not found');
        return music;
    }

    async create(body: CreateMusicDto) {
        const { title, uploadId, imageId, genreId, playlistId } = body;

        const upload = await this.uploadRepo.findOne({ where: { id: uploadId } });
        if (!upload || upload.type !== UploadType.AUDIO) {
            throw new NotFoundException('Audio upload not found or invalid type');
        }

        const image = imageId ? await this.uploadRepo.findOne({ where: { id: imageId } }) : null;
        if (imageId && (!image || image.type !== UploadType.IMAGE)) {
            throw new NotFoundException('Image not found or invalid type');
        }

        const genres = genreId ? await this.genreRepo.find({ where: { id: In(genreId) } }) : [];
        const playlists = playlistId ? await this.playlistRepo.find({ where: { id: In(playlistId) } }) : [];

        const author = this.cls.get<UserEntity>('user');
        if (!author) throw new NotFoundException('User not found');

        const music = this.musicRepo.create({
            title,
            upload,
            image,
            genre: genres,
            playList: playlists,
            author,
        });

        return await this.musicRepo.save(music);
    }

    async edit(id: number, body: EditMusicDto) {
        const music = await this.findOne({ id });
        const user = this.cls.get<UserEntity>('user');

        if (music.author.id !== user.id && user.role !== UserRoles.ADMIN && user.role !== UserRoles.SUPERADMIN) {
            throw new ForbiddenException("You are not authorized to edit this music.");
        }

        if (body.title) music.title = body.title;
        if (body.uploadId) {
            const upload = await this.uploadRepo.findOne({ where: { id: body.uploadId } });
            if (!upload || upload.type !== UploadType.AUDIO) {
                throw new NotFoundException('Audio upload not found or invalid type');
            }
            music.upload = upload;
        }
        
        if (body.imageId) {
            const image = await this.uploadRepo.findOne({ where: { id: body.imageId } });
            if (!image || image.type !== UploadType.IMAGE) {
                throw new NotFoundException('Image not found or invalid type');
            }
            music.image = image;
        }

        if (body.genreId) {
            const genres = await this.genreRepo.find({ where: { id: In(body.genreId) } });
            if (genres.length === 0) throw new NotFoundException("Genre not found.");
            music.genre = genres;
        }

        if (body.playlistId) {
            const playlists = await this.playlistRepo.find({ where: { id: In(body.playlistId) } });
            if (playlists.length === 0) throw new NotFoundException("Playlist not found.");
            music.playList = playlists;
        }

        return await this.musicRepo.save(music);
    }

    async delete(id: number) {
        const music = await this.findOne({ id });
        const user = this.cls.get<UserEntity>('user');

        if (music.author.id !== user.id && user.role !== UserRoles.ADMIN && user.role !== UserRoles.SUPERADMIN) {
            throw new ForbiddenException("You are not authorized to delete this music.");
        }

        return await this.musicRepo.remove(music);
    }
}
