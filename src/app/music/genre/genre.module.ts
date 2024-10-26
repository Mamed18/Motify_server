import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GenreEntity } from "src/database/entities/music/genre.entity";
import { GenreService } from "./genre.service";
import { GenreController } from "./genre.controller";
import { ClsModule } from "nestjs-cls";
import { UserModule } from "src/app/user/user.module";

@Module({
    imports:[TypeOrmModule.forFeature([GenreEntity]),ClsModule,UserModule],
    providers:[GenreService],
    controllers:[GenreController],
    exports:[GenreService],
})
export class GenreModule{}