import { forwardRef, Module } from "@nestjs/common";
import { FollowController } from "./follow.controller";
import { FollowService } from "./follow.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FollowEntity } from "src/database/entities/follow.entity";
import { UserEntity } from "src/database/entities/user.entity";
import { ClsModule } from "nestjs-cls";
import { UserService } from "../user/user.service";
import { UserModule } from "../user/user.module";

@Module({
    imports:[TypeOrmModule.forFeature([FollowEntity,UserEntity]),ClsModule, forwardRef(() => UserModule)],
    providers:[FollowService],
    controllers:[FollowController],
    exports:[FollowService],
})
export class FollowModule{}