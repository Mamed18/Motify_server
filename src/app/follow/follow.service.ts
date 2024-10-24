import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FollowEntity } from "src/database/entities/follow.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { ClsService } from "nestjs-cls";
import { FollowDto } from "./dto/follow.dto";
import { UserEntity } from "src/database/entities/user.entity";
import { FollowStatus } from "src/shared/enums/follow-status.enum";
import { SearchUserSelect } from "../user/user.select";

@Injectable()
export class FollowService {
    constructor(
        @InjectRepository(FollowEntity)
        private followRepo: Repository<FollowEntity>,
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        private userService: UserService,
        private cls: ClsService,
    ) { }

    async findOne(where: FindOptionsWhere<FollowEntity> | FindOptionsWhere<FollowEntity>[]) {
        return this.followRepo.findOne({ where })
    }

    async find(where: FindOptionsWhere<FollowEntity> | FindOptionsWhere<FollowEntity>[]) {
        return this.followRepo.find({ where })
    }

    async create(body: FollowDto) {
        let myUser = this.cls.get<UserEntity>('user')
        let user = await this.userService.findOne({ id: body.id })

        let checkExist = await this.findOne({ isFollowing: { id: myUser.id }, beingFollowed: { id: user.id } })
        if (checkExist) throw new ConflictException('Already following or requested')
        if (myUser.id === user.id) throw new ConflictException('Dont follow yourself')

        const status = user.isPrivate ? FollowStatus.REQUESTED : FollowStatus.FOLLOWING;

        let follow = this.followRepo.create({ isFollowing: myUser, beingFollowed: user, status })

        if (status === FollowStatus.FOLLOWING) {
            user.followersCount++;
            myUser.followingCount++;

            await this.userRepo.save(user);
            await this.userRepo.save(myUser);
        }

        return this.followRepo.save(follow)
    }

    async unfollow(id: number) {
        let myUser = this.cls.get<UserEntity>('user')
        let user = await this.userService.findOne({ id })
        if (!user) throw new NotFoundException('User not found')

        let follow = await this.findOne({ isFollowing: { id: myUser.id }, beingFollowed: { id: user.id } })
        if (!follow) throw new NotFoundException('Follow not found')

        if (follow.status === FollowStatus.FOLLOWING) {
            user.followersCount--
            myUser.followingCount--
            this.userRepo.save([user, myUser]);
        }

        await this.followRepo.remove(follow)
        return ({ message: 'Follow or request have been removed' })
    }

    async removeFollow(id: number) {
        let myUser = this.cls.get<UserEntity>('user')
        let user = await this.userService.findOne({ id })
        if (!user) throw new NotFoundException('User not found')

        let follow = await this.findOne({ isFollowing: { id: user.id }, beingFollowed: { id: myUser.id } })
        if (!follow) throw new NotFoundException('Follow not found')

        if (follow.status === FollowStatus.FOLLOWING) {
            myUser.followersCount--
            user.followingCount--
            this.userRepo.save([user, myUser]);
        }

        await this.followRepo.remove(follow)
        return ({ message: 'Follow or request have been removed' })
    }

    async requestList() {
        let myUser = await this.cls.get<UserEntity>('user')
        let requestList = await this.followRepo.find({
            where: { beingFollowed: { id: myUser.id }, status: FollowStatus.REQUESTED },
            relations: ['isFollowing'],
            select: {
                id: true,
                status: true,
                isFollowing: SearchUserSelect,
            }
        })

        return requestList
    }

    async acceptRequest(id: number) {
        let myUser = this.cls.get<UserEntity>('user')
        let user = await this.userService.findOne({ id })
        if (!user) throw new NotFoundException('User not found')

        let follow = await this.findOne({ beingFollowed: { id: myUser.id }, isFollowing: { id: user.id }, status: FollowStatus.REQUESTED })
        if (!follow) throw new NotFoundException('Request not found')

        follow.status = FollowStatus.FOLLOWING
        myUser.followersCount++
        user.followingCount++

        this.followRepo.save(follow)
        this.userRepo.save([myUser, user])
        return { message: 'Request is accepted' }
    }
}