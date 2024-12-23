import { BeforeRemove, Column, Entity, ManyToOne } from "typeorm";
import { CommonEntity } from "./common.entity";
import { FollowStatus } from "src/shared/enums/follow-status.enum";
import { UserEntity } from "./user.entity";

@Entity()
export class FollowEntity extends CommonEntity{
    @ManyToOne(() => UserEntity, user => user.following,{onDelete: 'CASCADE'})
    isFollowing: UserEntity;

    @ManyToOne(() => UserEntity, user => user.followers,{onDelete: 'CASCADE'})
    beingFollowed: UserEntity;

    @Column()
    status: FollowStatus;

}