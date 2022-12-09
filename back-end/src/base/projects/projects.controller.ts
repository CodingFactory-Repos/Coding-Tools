import { Controller, Get, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { ProjectsService } from 'src/base/projects/projects.service';

@Controller('projects')
@UseFilters(ServiceErrorCatcher)
export class ProjectsController {
	constructor(private readonly projectsService: ProjectsService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}
