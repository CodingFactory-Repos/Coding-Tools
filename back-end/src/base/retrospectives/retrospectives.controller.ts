import { Controller, Get, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { RetrospectivesService } from 'src/base/retrospectives/retrospectives.service';

@Controller('retrospectives')
@UseFilters(ServiceErrorCatcher)
export class RetrospectivesController {
	constructor(private readonly retrospectivesService: RetrospectivesService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}
