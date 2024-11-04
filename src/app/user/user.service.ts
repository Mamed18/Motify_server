import { Body, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/database/entities/user.entity";
import { FindManyOptions, FindOptionsWhere, ILike, Not, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { SearchUserDto } from "./dto/search-user.dto";
import { SearchUserSelect, UserProfileSelect, UserRestrictedSelect } from "./user.select";
import { FindManyParams } from "src/shared/types/find-params";
import { EditProfileDto, EditUserDto } from "./dto/edit-user.dto";
import { FollowEntity } from "src/database/entities/follow.entity";
import { FollowStatus } from "src/shared/enums/follow-status.enum";
import { UploadEntity } from "src/database/entities/upload.entity";
import { UploadType } from "src/shared/enums/upload.enum";
import { ClsService } from "nestjs-cls";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        @InjectRepository(FollowEntity)
        private followRepo: Repository<FollowEntity>,
        @InjectRepository(UploadEntity)
        private uploadRepo: Repository<UploadEntity>,

        private cls: ClsService,
    ) { }

    findOne(params: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[]) {
        return this.userRepo.findOne({ where: params })
    }

    find(params: FindManyParams<UserEntity>) {
        const { where, select, relations, page, limit, order } = params;

        const payload: FindManyOptions<UserEntity> = { where, select, relations, order };

        if (typeof limit === 'number' && limit > 0) {
            payload.take = limit;
            payload.skip = (page || 0) * limit;
        }
        return this.userRepo.find(payload);
    }

    async myProfile(): Promise<UserEntity> {
        const currentUser = this.cls.get<UserEntity>('user');
        if (!currentUser) {
            throw new UnauthorizedException('User not authenticated');
        }
    
        const user = await this.userRepo.findOne({
            where: { id: currentUser.id },
            relations: ['profilePicture', 'following.beingFollowed', 'followers.isFollowing', 'music', 'playList'],
            select: UserProfileSelect,
        });
    
        if (!user) {
            throw new NotFoundException('Profile not found');
        }
    
        return user;
    }
    
    async userProfile(id: number) {
        const currentUser = await this.cls.get<UserEntity>('user');
    
        const user = await this.userRepo.findOne({
            where: { id }
        });

        if (currentUser.id==user.id){
            return this.userRepo.findOne({
                where: { id },
                relations: ['following.beingFollowed', 'followers.isFollowing', 'music', 'playList'],
                select: UserProfileSelect,
            });
        }
    
        if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    
        if (!user.isPrivate) {
            return this.userRepo.findOne({
                where: { id },
                relations: ['following.beingFollowed', 'followers.isFollowing', 'music', 'playList'],
                select: UserProfileSelect,
            });
        }
    
        const follow = await this.followRepo.find({
            where: {
                beingFollowed: { id },
                isFollowing: { id: currentUser.id },
                status: FollowStatus.FOLLOWING,
            },
        });
    
        if (follow.length > 0) {
            return this.userRepo.findOne({
                where: { id },
                relations: ['following.beingFollowed', 'followers.isFollowing', 'music', 'playList'],
                select: UserProfileSelect,
            });
        }
        
        return this.userRepo.findOne({
            where: { id },
            relations: ['following.beingFollowed', 'followers.isFollowing'],
            select: UserRestrictedSelect,
        });
    }
    

    async create(@Body() body: Partial<CreateUserDto>) {
        let checkUserName = await this.findOne({ userName: body.userName });
        if (checkUserName) {
            throw new ConflictException('Username already exists');
        }

        let checkEmail = await this.findOne({ email: body.email })
        if (checkEmail) {
            throw new ConflictException('This email is already used')
        }

        let user = this.userRepo.create(body)

        return await this.userRepo.save(user);
    }

    async search(param: SearchUserDto) {
        const { searchParam, limit = 10, page = 0 } = param
        let where: FindOptionsWhere<UserEntity>[] = [
            {
                userName: ILike(`${searchParam}%`)
            },
            {
                firstName: ILike(`%${searchParam}%`)
            },
            {
                lastName: ILike(`%${searchParam}%`)
            },
        ]
        return await this.find({ where, select: SearchUserSelect, page, limit })
    }

    async editUser(id: number, body: Partial<EditUserDto> | Partial<EditProfileDto>) {
        let myUser = await this.findOne({ id })
        let payload: Partial<UserEntity> = {}

        for (let key in body) {
            switch (key) {
                case 'userName':
                    let checkUserName = await this.findOne({ userName: body.userName, id: Not(id) });
                    if (checkUserName)
                        throw new ConflictException('This username is already exists');

                    payload.userName = body.userName;
                    break;

                case 'profilePictureId':
                    const profilePicture = await this.uploadRepo.findOne({
                        where: { id: body.profilePictureId, type: UploadType.IMAGE },
                    });

                    if (!profilePicture) {
                        throw new NotFoundException('Profile picture not found or not an image');
                    }

                    payload.profilePicture = profilePicture;
                    break;

                case 'isPrivate':
                    payload.isPrivate = body.isPrivate;
                    if (body.isPrivate === false) {
                        let requestList = await this.followRepo.find({
                            where: { beingFollowed: { id }, status: FollowStatus.REQUESTED },
                            relations: ['isFollowing'],
                            select: {
                                id: true,
                                status: true,
                                isFollowing: SearchUserSelect,
                            }
                        });

                        await this.userRepo.manager.transaction(async (transactionalEntityManager) => {
                            myUser.followersCount += requestList.length;

                            for (const request of requestList) {
                                request.status = FollowStatus.FOLLOWING;

                                const userBeingFollowed = await transactionalEntityManager.findOne(UserEntity, { where: { id: request.isFollowing.id } });

                                if (userBeingFollowed) {
                                    userBeingFollowed.followingCount++;
                                    await transactionalEntityManager.save(FollowEntity, request);
                                    await transactionalEntityManager.save(UserEntity, userBeingFollowed);
                                }
                            }

                            await transactionalEntityManager.save(UserEntity, myUser);
                        });
                    }
                    break;

                default:
                    payload[key] = body[key]
                    break
            }
        }

        await this.userRepo.update(id, payload)
        return {
            status: true,
            message: 'Profile is successfully updated',
        };
    }

    async deleteUser(id: number) {
        // Start a transaction
        await this.userRepo.manager.transaction(async (transactionalEntityManager) => {
            // Find the user with relations for followers and following
            let user = await transactionalEntityManager.findOne(UserEntity, {
                where: { id },
                relations: ['followers', 'followers.isFollowing', 'following', 'following.beingFollowed']
            });

            if (!user) throw new NotFoundException('User not found');

            // Decrease followersCount for users who follow this user
            let followers = user.followers;
            if (followers && followers.length > 0) {
                for (const follow of followers) {
                    const followerUser = follow.isFollowing; // The user who is following this user
                    followerUser.followingCount--; // This person is following one less person now
                    await transactionalEntityManager.save(UserEntity, followerUser); // Save the updated following count
                }
            }

            // Decrease followingCount for users that this user follows
            let following = user.following;
            if (following && following.length > 0) {
                for (const follow of following) {
                    const followedUser = follow.beingFollowed; // The user this person was following
                    followedUser.followersCount--; // This person lost a follower
                    await transactionalEntityManager.save(UserEntity, followedUser); // Save the updated follower count
                }
            }

            // Remove all follow relationships related to the user
            await transactionalEntityManager.delete(FollowEntity, { beingFollowed: { id } });
            await transactionalEntityManager.delete(FollowEntity, { isFollowing: { id } });

            // Finally, delete the user
            await transactionalEntityManager.remove(UserEntity, user);
        });

        return { status: true, message: 'User and related data deleted successfully' };
    }


}