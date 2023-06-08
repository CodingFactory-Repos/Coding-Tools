import {
	Controller,
	Get,
	Post,
	Res,
	Req,
	UseFilters,
	UseGuards,
	Param,
} from '@nestjs/common';
import { Response,Request } from 'express';
import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { CoursesService } from 'src/base/courses/courses.service';
import { JwtAuthGuard } from '@/common/guards/auth.guard';
import { ObjectId } from 'mongodb';

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

	@Get('/allCourses')
	async getAllCourses(@Res() res: Response) {
		const courses = await this.coursesService.getAllCourses();
		return res.status(200).json({ status: 'ok', courses })
	}

	@Get('/:id')
	async getCoursesByI(@Req() req: Request, @Res() res: Response, @Param('id') courseId: string){
		const courseById = await this.coursesService.getCoursesById(courseId)
		return res.status(200).json({ status: 'ok', courseById });
	}


	@Post('/create')
	async createCourse(@Req() req: Request, @Res() res: Response) {
		await this.coursesService.createCourse(req.body).then((course) => {
			res.status(200).json(course);
		});
	}

	async index(@Res() res: Response) {
		const courses = await this.coursesService.getAllCourses();
		return res.status(200).json(courses);
	}

}



