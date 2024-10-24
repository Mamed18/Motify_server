import { Body, Controller, Param, Post, Delete, UseGuards, ParseIntPipe, Get, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { AuthRolesGuard } from "src/guards/auth-roles.guard";
import { FollowService } from "./follow.service";
import { FollowDto } from "./dto/follow.dto";

@Controller('follow')
@ApiBearerAuth()
@ApiTags('Follow')
@UseGuards(AuthRolesGuard)
export class FollowController {
    constructor(
        private followService: FollowService,
    ) { }

    @Post()
    follow(@Body() body: FollowDto) {
        return this.followService.create(body)
    }

    @Delete('unfollow/:id')
    @ApiParam({ name: 'id', required: true, description: 'Who you want to unfollow or unrequest follow' })
    unfollow(@Param('id', ParseIntPipe) id: number) {
        return this.followService.unfollow(id)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', required: true, description: 'Remove follower or decline request' })
    removeFollow(@Param('id', ParseIntPipe) id: number) {
        return this.followService.removeFollow(id)
    }


    @Get('requests')
    requstList() {
        return this.followService.requestList()
    }

    @Put('requests/:id')
    @ApiParam({ name: 'id', required: true, description: 'Id of user, you want to accept' })
    acceptRequest(@Param('id', ParseIntPipe) id: number) {
        return this.followService.acceptRequest(id)
    }
}