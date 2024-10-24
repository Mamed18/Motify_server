import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { UploadEntity } from 'src/database/entities/upload.entity';
import { getUploadType } from 'src/shared/functions/upload-type-determine';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(UploadEntity)
    private uploadRepo: Repository<UploadEntity>,
  ) { }

  async uploadFile(req: Request, file: Express.Multer.File) {
    if (!file || !file.filename) {
      throw new BadRequestException('File or filename is missing');
    }
  
    let port = req.socket.localPort;
    let type = getUploadType(file)
  
    let upload = this.uploadRepo.create({
      filename: file.filename,
      url: `${req.protocol}://${req.hostname}${port ? `:${port}` : ''}/uploads/${file.filename}`,
      type,
    });
  
    return await this.uploadRepo.save(upload);
  }

  async deleteFile(id: number): Promise<{ message: string }> {
    const upload = await this.uploadRepo.findOne({ where: { id } });
    if (!upload) {
      throw new NotFoundException(`Upload with id ${id} not found`);
    }
    
    await this.uploadRepo.remove(upload);

    return { message: `File with id ${id} has been successfully deleted` };
  }
}