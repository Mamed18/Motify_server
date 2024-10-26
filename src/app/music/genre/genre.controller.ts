import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { GenreService } from "./genre.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthRolesGuard } from "src/guards/auth-roles.guard";
import { UserRoles } from "src/shared/enums/user.enum";
import { Roles } from "src/shared/decorators/roles.decorator";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { UpdateGenreDto } from "./dto/update-genre.dto";

@Controller('genre')
@ApiTags('Genre')
@ApiBearerAuth()
export class GenreController{
    constructor(
        private genreService: GenreService
    ){}

    @Get()
    async findAll(){
        return this.genreService.findAll()
    }

    @Post()
    @UseGuards(AuthRolesGuard)
    @Roles(UserRoles.ADMIN,UserRoles.SUPERADMIN)
    async create(@Body() body: CreateGenreDto) {
        return this.genreService.create(body);
    }

    @Get(':id')
    async findOne(@Param('id',ParseIntPipe) id: number) {
        let genre = await this.genreService.findOne({id});
        if (!genre) throw new NotFoundException(`Genre with ID ${id} not found`)
        return genre
    }

    @Put(':id')
    @UseGuards(AuthRolesGuard)
    @Roles(UserRoles.ADMIN,UserRoles.SUPERADMIN)
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateGenreDto) {
        return this.genreService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AuthRolesGuard)
    @Roles(UserRoles.ADMIN,UserRoles.SUPERADMIN)
    async remove(@Param('id',ParseIntPipe) id: number){
        return this.genreService.remove(id)
    }

}