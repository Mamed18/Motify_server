import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PlayListEntity } from "./playlist.entity";
import { MusicEntity } from "./music.entity";
import { CommonEntity } from "../common.entity";

@Entity()
export class PlayListMusicEntity extends CommonEntity {

    @ManyToOne(() => PlayListEntity, playlist => playlist.musicTracks, { onDelete: 'CASCADE' })
    playlist: PlayListEntity;

    @ManyToOne(() => MusicEntity, { onDelete: 'CASCADE' })
    music: MusicEntity;

    @Column()
    order: number;
}
