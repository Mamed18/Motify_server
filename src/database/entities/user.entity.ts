import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { CommonEntity } from "./common.entity";
import * as bcrypt from 'bcrypt'
import { UserRoles } from "src/shared/enums/user.enum";
import { UploadEntity } from "./upload.entity";
import { FollowEntity } from "./follow.entity";
import { MusicEntity } from "./music/music.entity";
import { PlayListEntity } from "./music/playlist.entity";

@Entity('user')
export class UserEntity extends CommonEntity {
    @Column({ nullable: true })
    firstName: string

    @Column({ nullable: true })
    lastName: string

    @Column({ unique: true })
    userName: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @OneToOne(() => UploadEntity, { eager: true, nullable: true })
    @JoinColumn()
    profilePicture: Partial<UploadEntity>

    @Column({ nullable: true })
    bio: string

    @Column()
    birthDate: Date

    @Column({ default: 0 })
    followersCount: number

    @Column({ default: 0 })
    followingCount: number

    @OneToMany(() => FollowEntity, follow => follow.isFollowing)
    following: FollowEntity[];

    @OneToMany(() => FollowEntity, follow => follow.beingFollowed)
    followers: FollowEntity[];


    @Column({ default: false })
    isPrivate: boolean

    @Column({
        type: 'enum',
        enum: UserRoles,
    })
    role: UserRoles

    @OneToMany(()=> MusicEntity, music => music.author)
    music: MusicEntity[]

    @OneToMany(()=> PlayListEntity, playList => playList.creator)
    playList: PlayListEntity[]

    @BeforeInsert()
    async beforeInsert() {
        this.password = await bcrypt.hash(this.password, 10)
    }

    get fullName() {
        return [this.firstName, this.lastName].filter(Boolean).join(' ');
    }
}