import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/database/entities/user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { FollowEntity } from "src/database/entities/follow.entity";
import { FollowModule } from "../follow/follow.module";
import { UploadEntity } from "src/database/entities/upload.entity";
import { UploadModule } from "../upload/upload.module";
import { ClsModule } from "nestjs-cls";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, FollowEntity, UploadEntity]),
        FollowModule,
        ClsModule,
        forwardRef(() => UploadModule)
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}