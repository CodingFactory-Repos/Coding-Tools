import { Controller, Get, Res, Req, UseFilters, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { CoursesService } from 'src/base/courses/courses.service';
import { JwtAuthGuard } from '@/common/guards/auth.guard';

@Controller('courses')
@UseFilters(ServiceErrorCatcher)
@UseGuards(JwtAuthGuard)
export class CoursesController {
	constructor(private readonly coursesService: CoursesService) {}

	@Get('')
	async index(@Res() res: Response) {
		const courses = await this.coursesService.getAllCourses();
		return res.status(200).json(courses);
	}

	@Get('/:id/')
	async getCourseById(@Req() req: Request, @Res() res: Response) {
		const course = await this.coursesService.getCourseById(req.params.id);
		return res.status(201).json(course);
	}
}
