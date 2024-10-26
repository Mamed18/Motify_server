import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenreEntity } from "src/database/entities/music/genre.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { UpdateGenreDto } from "./dto/update-genre.dto";

@Injectable()
export class GenreService{
   constructor(
       @InjectRepository(GenreEntity)
       private genreRepo: Repository<GenreEntity>
   ){}
   
   async findOne(params: FindOptionsWhere<GenreEntity> | FindOptionsWhere<GenreEntity>[]) {
       return await this.genreRepo.findOne({ where: params, relations: ['music'] })
   }

   async findAll(){
       return this.genreRepo.find();
   }

   async create(body: CreateGenreDto){
       let check = await this.findOne({name: body.name})
       if(check) throw new ConflictException('Genre already exist')
       
       const genre = this.genreRepo.create(body)
       return await this.genreRepo.save(genre);
   }

   async update(id: number, body: UpdateGenreDto){
       let genre = await this.findOne({id});
       if(!genre) throw new NotFoundException('Genre not found')
       await this.genreRepo.update(id, body); 
       return {message: 'Successfully updated'}
   }

   async remove(id: number){
       const genre = await this.findOne({id});
       if(!genre) throw new NotFoundException('Genre not found')
       return await this.genreRepo.remove(genre);
   }
}