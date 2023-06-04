import { Controller, Get, Param, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { GroupsService } from 'src/base/groups/groups.service';
import { JwtAuthGuard } from '@/common/guards/auth.guard';
import { Jwt } from '@/common/decorators/jwt.decorator';
import { ObjectId } from 'mongodb';

@Controller('groups')
@UseFilters(ServiceErrorCatcher)
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    @Get()
    index(@Res() res: Response) {
        return res.status(201).json({ status: 'ok' });
    }

	@Get('/:courseId/:groupId')
	@UseGuards(JwtAuthGuard)
	async updateGroupStudents(
	  @Jwt() userId: ObjectId,
	  @Param('groupId') groupId: number,
	  @Param('courseId') courseId: string, // <-- Change the type to string
	  @Res() res: Response
	) {
	  const message = await this.groupsService.getGroup(new ObjectId(courseId), groupId, userId);
	  return res.status(201).json({ array: message });
	}
}
