import { Column, Entity, ManyToMany } from "typeorm";
import { CommonEntity } from "../common.entity";
import { MusicEntity } from "./music.entity";

@Entity()
export class GenreEntity extends CommonEntity{

    @Column()
    name: string

    @ManyToMany(()=> MusicEntity, music=>music.genre)
    music: MusicEntity[]
}