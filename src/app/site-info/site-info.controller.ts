import { Controller, UseGuards, Post, Body, Put } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AuthRolesGuard } from "src/guards/auth-roles.guard";
import { Roles } from "src/shared/decorators/roles.decorator";
import { UserRoles } from "src/shared/enums/user.enum";
import { UpdateSiteInfoDto } from "./dto/uodate-site-info.dto";
import { SiteInfoService } from "./site-info.service";

@Controller('site-info')
@ApiTags('Site Info')
@ApiBearerAuth()
@UseGuards(AuthRolesGuard)
@Roles(UserRoles.ADMIN, UserRoles.SUPERADMIN)
export class SiteInfoController {
    constructor(private siteInfoService: SiteInfoService) {}

    @Post()
    async createSiteInfo(@Body() createDto: UpdateSiteInfoDto) {
        return await this.siteInfoService.createSiteInfo(createDto);
    }

    @Put()
    async updateSiteInfo(@Body() updateDto: UpdateSiteInfoDto) {
        return await this.siteInfoService.updateSiteInfo(updateDto);
    }
}