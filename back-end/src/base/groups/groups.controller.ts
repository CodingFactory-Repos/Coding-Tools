import { Controller, Get, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { GroupsService } from 'src/base/groups/groups.service';

@Controller('groups')
@UseFilters(ServiceErrorCatcher)
export class GroupsController {
	constructor(private readonly groupsService: GroupsService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}
