import { Controller, Get, Res, UseFilters, Post, Req, Put, UseGuards, Delete, Patch } from '@nestjs/common';
import { Response, Request } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';

import { JwtAuthGuard } from '@/common/guards/auth.guard';
import { ObjectId } from 'mongodb';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseFilters(ServiceErrorCatcher)
@UseGuards(JwtAuthGuard)
export class ProjectsController {
	constructor(private readonly projectsService: ProjectsService) {}

	@Get('')
	async getProject(@Req() req: Request, @Res() res: Response) {
		const project = await this.projectsService.getProject();
		return res.status(201).json(project);
	}

	@Get('/courseOrCreator/:id')
	async getProjectByCourseOrCreator(@Req() req: Request, @Res() res: Response) {
		const project = await this.projectsService.getProjectByCourseOrCreator(req.params.id);
		return res.status(201).json(project);
	}

	@Get('/exists/:courseId/:userId')
	async doesProjectExist(@Req() req: Request, @Res() res: Response) {
		const project = await this.projectsService.getProjectByCourseAndMembers(req.params.courseId, req.params.userId);
		return res.status(201).json(project);
	}

	@Get('/groupMember/:id')
	async getProjectByGroupMember(@Req() req: Request, @Res() res: Response) {
		const project = await this.projectsService.getProjectByGroupMember(req.params.id);
		return res.status(201).json(project);
	}

	@Post('/create')
	async addProject(@Req() req: Request, @Res() res: Response) {
		req.body.course = new ObjectId(req.body.course);
		const project = await this.projectsService.createProject(req.body);
		return res.status(201).json({ project, id: project.insertedId });
	}

	@Get('/:id')
	async getProjectById(@Req() req: Request, @Res() res: Response) {
		const project = await this.projectsService.getProjectById(req.params.id);
		return res.status(201).json(project);
	}

	@Get('/get_project/:courseId/:userId')
	async getProjectByCourseAndMembers(@Req() req: Request, @Res() res: Response) {
		const project = await this.projectsService.getProjectByCourseAndMembers(req.params.courseId, req.params.userId);
		return res.status(201).json(project);
	}

	@Get('/course/:id')
	async getProjectByCourseId(@Req() req: Request, @Res() res: Response) {
		const project = await this.projectsService.getProjectByCourseId(req.params.id);
		return res.status(201).json(project);
	}

	@Delete('/delete/:id')
	async deleteProjectById(@Req() req: Request, @Res() res: Response) {
		const project = await this.projectsService.deleteProjectById(req.params.id);
		return res.status(201).json(project);
	}

	@Put('/update/:id')
	async updateProject(@Req() req: Request, @Res() res: Response) {
		const update = { $set: req.body };
		const project = await this.projectsService.updateProject(req.params.id, update);
		return res.status(201).json(project);
	}
}

