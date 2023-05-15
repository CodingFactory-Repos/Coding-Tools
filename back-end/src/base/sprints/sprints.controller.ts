import { Controller, Get, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { SprintsService } from 'src/base/sprints/sprints.service';

@Controller('sprints')
@UseFilters(ServiceErrorCatcher)
export class SprintsController {
	constructor(private readonly groupsService: SprintsService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}
