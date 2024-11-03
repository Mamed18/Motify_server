import { Column, Entity, JoinTable, ManyToOne, OneToMany } from "typeorm";
import { CommonEntity } from "../common.entity";
import { UserEntity } from "../user.entity";
import { PlayListMusicEntity } from "./playlistmusic.entity";

@Entity()
export class PlayListEntity extends CommonEntity{

    @Column()
    title: string

    @Column({nullable:true})
    description: string

    @ManyToOne(()=> UserEntity, user => user.playList,{onDelete: 'CASCADE'})
    creator: UserEntity

    @OneToMany(() => PlayListMusicEntity, playlistMusic => playlistMusic.playlist, { cascade: true })
    musicTracks: PlayListMusicEntity[];
}