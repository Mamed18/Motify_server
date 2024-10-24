import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UploadEntity } from "src/database/entities/upload.entity";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";
import { UserModule } from "../user/user.module";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join, extname } from "path";

@Module({
    imports: [
        TypeOrmModule.forFeature([UploadEntity]),
        forwardRef(() => UserModule),
        MulterModule.register({
            storage: diskStorage({
                destination: join(__dirname, '../../../uploads'),
                filename: (req, file, callback) => {
                    callback(
                        null,
                        `${Date.now()}${extname(file.originalname).toLowerCase()}`,
                    );
                },
            }),
        }),
    ],
    providers: [UploadService],
    controllers: [UploadController],
    exports: [TypeOrmModule,UploadModule],
})
export class UploadModule { }