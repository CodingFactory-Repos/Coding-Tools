import { Controller, Get, Param, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { GroupsService } from 'src/base/groups/groups.service';
import { JwtAuthGuard } from '@/common/guards/auth.guard';
import { ObjectId } from 'mongodb';
import { Jwt } from '@/common/decorators/jwt.decorator';
import { RoleValidator } from '@/common/guards/role.guard';
import { Roles } from '../users/interfaces/users.interface';

@Controller('groups')
@UseFilters(ServiceErrorCatcher)
export class GroupsController {
	constructor(private readonly groupsService: GroupsService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}

	@Get('lock/:id')
	@UseGuards(JwtAuthGuard, new RoleValidator(Roles.PRODUCT_OWNER))
	async lockGroup(@Res() res: Response, @Param('id') courseId: string, @Jwt() userId: ObjectId) {
		const lockGroup = await this.groupsService.lockGroup(courseId, userId);

		return res.status(201).json({ status: 'ok' });
	}

}
