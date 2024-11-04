import { UserEntity } from "src/database/entities/user.entity";
import { FindOptionsSelect } from "typeorm";

export const SearchUserSelect: FindOptionsSelect<UserEntity> = {
    id: true,
    userName: true,
    firstName: true,
    lastName: true,
    profilePicture: {
        id: true,
        url: true,
    },
}

export const UserRestrictedSelect: FindOptionsSelect<UserEntity> = {
    id: true,
    bio: true,
    firstName: true,
    lastName: true,
    userName: true,
    followersCount: true,
    followingCount: true,
    profilePicture: {
        id: true,
        url: true,
    },
    isPrivate: true,
    followers: {
        id: true,
        status: true,
        isFollowing: {
            id: true,
            userName: true,
        }
    },
    following: {
        id: true,
        status: true,
        beingFollowed: {
            id: true,
            userName: true,
        }
    }
}

export const UserProfileSelect: FindOptionsSelect<UserEntity> = {
    id: true,
    bio: true,
    firstName: true,
    lastName: true,
    userName: true,
    followersCount: true,
    followingCount: true,
    profilePicture: {
        id: true,
        url: true,
    },
    isPrivate: true,
    followers: {
        id: true,
        status: true,
        isFollowing: {
            id: true,
            userName: true,
        }
    },
    following: {
        id: true,
        status: true,
        beingFollowed: {
            id: true,
            userName: true,
        }
    },
    music: {
        id: true,
        title: true,
        upload: {
            id: true,
            url: true
        },
        image: {
            id: true,
            url: true
        },
        genre: {
            id: true,
            name: true
        }
    },
    playList: {
        id: true,
        title: true,
        description: true,
        musicTracks: {
            id: true,
            order: true,
            music: {
                id: true,
                title: true
            }
        }
    }
}
