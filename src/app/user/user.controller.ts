import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags, OmitType, PartialType } from "@nestjs/swagger";
import { SearchUserDto } from "./dto/search-user.dto";
import { AuthRolesGuard } from "src/guards/auth-roles.guard";
import { ClsService } from "nestjs-cls";
import { UserEntity } from "src/database/entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { Roles } from "src/shared/decorators/roles.decorator";
import { UserRoles } from "src/shared/enums/user.enum";
import { EditProfileDto, EditUserDto } from "./dto/edit-user.dto";

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
    constructor(
        private userService: UserService,
        private cls: ClsService,
    ) { }

    //creat user
    @Post()
    @UseGuards(AuthRolesGuard)
    @Roles(UserRoles.ADMIN, UserRoles.SUPERADMIN)
    create(@Body() body: CreateUserDto) {
        return this.userService.create(body)
    }

    //update user
    @Put('profile/:id')
    @UseGuards(AuthRolesGuard)
    @Roles(UserRoles.ADMIN, UserRoles.SUPERADMIN)
    @ApiParam({ name: 'id', required: true, description: 'ID of the user' })
    editUser(@Param('id', ParseIntPipe) id: number, @Body() body: EditUserDto) {
        return this.userService.editUser(id, body);
    }

    //delete user
    @Delete('profile/:id')
    @UseGuards(AuthRolesGuard)
    @Roles(UserRoles.ADMIN,UserRoles.SUPERADMIN)
    async deleteUserById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteUser(id);
    }

    //get all users
    @Get()
    getAll() {
        return this.userService.find({})
    }

    //get my profile
    @Get('myProfile')
    @UseGuards(AuthRolesGuard)
    myProfile() {
        let user = this.cls.get<UserEntity>('user')
        return this.userService.userProfile(user.id)
    }

    //edit my profile
    @Put('myProfile')
    @UseGuards(AuthRolesGuard)
    async updateProfile(@Body() body: EditProfileDto) {
        let user = this.cls.get<UserEntity>('user');
        if (!user || !user.id) {
            throw new UnauthorizedException('User not found or not authenticated');
        }
        return this.userService.editUser(user.id, body);
    }

    //delete my profile
    @Delete('myProfile')
    @UseGuards(AuthRolesGuard)
    async deleteMyProfile() {
        const user = this.cls.get<UserEntity>('user');
        return this.userService.deleteUser(user.id);
    }

    //get profile by id
    @Get('profile/:id')
    @ApiParam({ name: 'id', required: true, description: 'ID of the user' })
    async userProfile(@Param('id', ParseIntPipe) id: number) {
        let user = await this.userService.userProfile(id)
        if (!user) throw new NotFoundException
        return user
    }

    //search
    @Get('search')
    search(@Query() query: SearchUserDto) {
        return this.userService.search(query)
    }


}