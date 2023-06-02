import { Controller, Get, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { CoursesService } from 'src/base/courses/courses.service';

@Controller('courses')
@UseFilters(ServiceErrorCatcher)
export class CoursesController {
	constructor(private readonly coursesService: CoursesService) {}

	@Get()
	async getAllCourses(@Res() res: Response) {
		const courses = await this.coursesService.getAllCourses();
		return res.status(201).json({ status: 'ok', courses });
	}

	@Get(':id')
	async getOneCourse(@Res() res: Response) {
		const course = await this.coursesService.getOneCourse('id');
		return res.status(201).json({ status: 'ok', course });
	}
}
