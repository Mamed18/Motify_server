import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from "typeorm";
import { CommonEntity } from "../common.entity";
import { UserEntity } from "../user.entity";
import { UploadEntity } from "../upload.entity";
import { GenreEntity } from "./genre.entity";
import { PlayListEntity } from "./playlist.entity";

@Entity()
export class MusicEntity extends CommonEntity{

    @ManyToOne(()=> UserEntity, user => user.music,{onDelete: 'CASCADE'})
    author: UserEntity;

    @Column()
    title: string

    @OneToOne(()=> UploadEntity, {onDelete: 'CASCADE'})
    @JoinColumn()
    upload: UploadEntity

    @OneToOne(()=> UploadEntity, {onDelete: 'CASCADE',nullable: true})
    @JoinColumn()
    image: UploadEntity

    @ManyToMany(()=> GenreEntity, genre=>genre.music,{nullable:true})
    @JoinTable()
    genre: GenreEntity[]

    @ManyToMany(()=> PlayListEntity, playList => playList.music)
    playList: PlayListEntity[]
}