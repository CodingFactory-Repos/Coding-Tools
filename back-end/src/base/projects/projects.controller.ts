import { Controller, Get, Post, Res, UseFilters, Body, Req } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { ProjectsService } from 'src/base/projects/projects.service';

@Controller('projects')
@UseFilters(ServiceErrorCatcher)
export class ProjectsController {
	constructor(private readonly projectsService: ProjectsService) { }

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}

	// @Post('/create_project')
	// createProject(@Req() req: Request, @Res() res: Response) {
	// 	this.projectsService.createProject(req.body).then((projects) => {
	// 		return res.status(201).json(projects);
	// 	});
	}
