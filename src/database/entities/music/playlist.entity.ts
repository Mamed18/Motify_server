import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { CommonEntity } from "../common.entity";
import { UserEntity } from "../user.entity";
import { MusicEntity } from "./music.entity";

@Entity()
export class PlayListEntity extends CommonEntity{

    @Column()
    title: string

    @Column({nullable:true})
    describtion: string

    @ManyToOne(()=> UserEntity, user => user.playList,{onDelete: 'CASCADE'})
    creator: UserEntity

    @ManyToMany(()=>MusicEntity, music => music.playList)
    @JoinTable()
    music: MusicEntity[]
}