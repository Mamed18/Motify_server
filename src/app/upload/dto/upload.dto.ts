import { ApiProperty } from '@nestjs/swagger';

export class UploadDto {
  @ApiProperty({
    format: 'binary',
    name: 'file',
  })
  file: Express.Multer.File;
}