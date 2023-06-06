import {
	Controller,
	Get,
	Res,
	Req,
	UseFilters,
	UseGuards,
} from '@nestjs/common';
import { Response,Request } from 'express';
import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { CoursesService } from 'src/base/courses/courses.service';
import { JwtAuthGuard } from '@/common/guards/auth.guard';

@Controller('courses')
@UseFilters(ServiceErrorCatcher)
@UseGuards(JwtAuthGuard)
export class CoursesController {
	constructor(private readonly coursesService: CoursesService) {}

	@Get('')
	getCourses(@Req() req: Request, @Res() res: Response){
		this.coursesService.getAllCourses().then((courses) => {
			return res.status(201).json(courses);
		});
	}
	@Get('/:id')
	getCoursesByI(@Req() req: Request, @Res() res: Response){
		this.coursesService.getCoursesById(req.params.id).then((courses) => {
			return res.status(201).json(courses);
		});
	}

	async index(@Res() res: Response) {
		const courses = await this.coursesService.getAllCourses();
		return res.status(200).json(courses);
	}
}



