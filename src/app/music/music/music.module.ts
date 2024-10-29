import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClsModule } from "nestjs-cls";
import { MusicEntity } from "src/database/entities/music/music.entity";
import { MusicService } from "./music.service";
import { MusicController } from "./music.controller";
import { UploadEntity } from "src/database/entities/upload.entity";
import { GenreEntity } from "src/database/entities/music/genre.entity";
import { PlayListEntity } from "src/database/entities/music/playlist.entity";
import { UserModule } from "src/app/user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([MusicEntity,UploadEntity,GenreEntity,PlayListEntity]),ClsModule,UserModule],
    providers: [MusicService],
    controllers: [MusicController],
    exports: [MusicService]
})
export class MusicModule{}