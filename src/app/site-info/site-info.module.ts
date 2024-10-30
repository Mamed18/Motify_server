import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SiteInfoEntity } from "src/database/entities/site-info.entity";
import { SiteInfoController } from "./site-info.controller";
import { SiteInfoService } from "./site-info.service";
import { UploadEntity } from "src/database/entities/upload.entity";
import { UserModule } from "../user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([SiteInfoEntity,UploadEntity]),forwardRef(() => UserModule)],
    providers: [SiteInfoService],
    controllers: [SiteInfoController],
    exports: [SiteInfoService],
})
export class SiteInfoModule{}