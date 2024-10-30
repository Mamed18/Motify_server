import { Injectable, NotFoundException, ConflictException, BadRequestException } from "@nestjs/common"; 
import { InjectRepository } from "@nestjs/typeorm";
import { SiteInfoEntity } from "src/database/entities/site-info.entity";
import { UploadEntity } from "src/database/entities/upload.entity";
import { UploadType } from "src/shared/enums/upload.enum";
import { Repository } from "typeorm";
import { UpdateSiteInfoDto } from "./dto/uodate-site-info.dto";

@Injectable()
export class SiteInfoService {
    constructor(
        @InjectRepository(SiteInfoEntity)
        private siteInfoRepo: Repository<SiteInfoEntity>,

        @InjectRepository(UploadEntity)
        private uploadRepo: Repository<UploadEntity>,
    ) {}

    async getSiteInfo(): Promise<SiteInfoEntity> {
        const siteInfo = await this.siteInfoRepo.findOne({
            where: {},
            relations: ['logo'],
        });

        if (!siteInfo) throw new NotFoundException('Site info not found');
        return siteInfo;
    }

    async createSiteInfo(createDto: UpdateSiteInfoDto): Promise<SiteInfoEntity> {
        const existingInfo = await this.siteInfoRepo.findOne({ where: {} });
        if (existingInfo) throw new ConflictException('Site info already exists');

        const siteInfo = this.siteInfoRepo.create(createDto);

        if (createDto.logoId) {
            const logo = await this.uploadRepo.findOne({ where: { id: createDto.logoId } });
            if (!logo) throw new NotFoundException('Logo upload not found');

            if (logo.type !== UploadType.IMAGE) {
                throw new BadRequestException('Logo must be an image');
            }

            siteInfo.logo = logo;
        }

        return await this.siteInfoRepo.save(siteInfo);
    }

    async updateSiteInfo(updateDto: UpdateSiteInfoDto): Promise<SiteInfoEntity> {
        const siteInfo = await this.getSiteInfo();

        if (updateDto.logoId) {
            const logo = await this.uploadRepo.findOne({ where: { id: updateDto.logoId } });
            if (!logo) throw new NotFoundException('Logo upload not found');

            if (logo.type !== UploadType.IMAGE) {
                throw new BadRequestException('Logo must be an image');
            }

            siteInfo.logo = logo;
        }

        Object.assign(siteInfo, updateDto);
        return await this.siteInfoRepo.save(siteInfo);
    }
}
