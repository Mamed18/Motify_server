import { Controller, Delete, Param, UseGuards, UseInterceptors, UploadedFile, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, Req, BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiBody, ApiTags } from "@nestjs/swagger";
import { UploadService } from "./upload.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from 'express'
import { Roles } from "src/shared/decorators/roles.decorator";
import { UserRoles } from "src/shared/enums/user.enum";
import { AuthRolesGuard } from "src/guards/auth-roles.guard";

@Controller('upload')
@ApiTags('Upload')
@UseGuards(AuthRolesGuard)
@ApiBearerAuth()
export class UploadController {
    constructor(
        private uploadService: UploadService
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      required: true,
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    async upload(
        @Req() request: Request,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 8 * 1024 * 1024 }), // 8 MB
                    new FileTypeValidator({ fileType: /(image\/jpeg|image\/png|image\/gif|image\/bmp|image\/webp|audio\/mpeg|audio\/wav|audio\/ogg|audio\/mp3|audio\/aac)$/i }),
                ],
            }),
        )
        file: Express.Multer.File,
    ){
        return this.uploadService.uploadFile(request, file);
    }

    @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.uploadService.deleteFile(id)
  }
}