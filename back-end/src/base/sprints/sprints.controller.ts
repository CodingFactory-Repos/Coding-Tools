import { Controller, Get, Res, UseFilters, UseGuards, Param } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '@/common/guards/auth.guard';
import { Jwt } from '@/common/decorators/jwt.decorator';
import { ObjectId } from 'mongodb';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { SprintsService } from 'src/base/sprints/sprints.service';

import { RoleValidator } from '@/common/guards/role.guard';
import { Roles } from '@/base/users/interfaces/users.interface';

@Controller('sprints')
@UseFilters(ServiceErrorCatcher)
export class SprintsController {
	constructor(private readonly sprintsService: SprintsService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}

	@Get('/actual_course')
	@UseGuards(JwtAuthGuard)
	async actualCourse(@Jwt() userId: ObjectId, @Res() res: Response) {
		const actualCourse = await this.sprintsService.getActualCourse(userId);
		return res.status(201).json({ status: 'ok', actualCourse: actualCourse });
	}
}
