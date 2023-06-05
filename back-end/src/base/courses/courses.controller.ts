import { Controller, Get, Res, UseFilters, Req } from '@nestjs/common';
import { Response,Request } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { CoursesService } from 'src/base/courses/courses.service';

@Controller('courses')
@UseFilters(ServiceErrorCatcher)
export class CoursesController {
	constructor(private readonly coursesService: CoursesService) {}

	@Get('')
	getCourses(@Req() req: Request, @Res() res: Response){
		this.coursesService.getAllCourses().then((courses) => {
			return res.status(201).json(courses);
		});
	}
}




