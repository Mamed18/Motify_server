import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MusicEntity } from "src/database/entities/music/music.entity";
import { PlayListEntity } from "src/database/entities/music/playlist.entity";
import { PlayListMusicEntity } from "src/database/entities/music/playlistmusic.entity";
import { PlaylistController } from "./playlist.controller";
import { PlaylistService } from "./playlist.service";
import { UserModule } from "src/app/user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([PlayListEntity, MusicEntity, PlayListMusicEntity]),UserModule],
    controllers: [PlaylistController],
    providers: [PlaylistService],
})
export class PlaylistModule {}