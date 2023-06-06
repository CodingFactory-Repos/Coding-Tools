import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CoursesRepository } from 'src/base/courses/courses.repository';

@Injectable()
export class CoursesService {
	constructor(
		@Inject(forwardRef(() => CoursesRepository))
		private coursesRepository: CoursesRepository,
	) {}

	// Business logic methods goes there...
	// Define your own methods

	async getAllCourses() {
		return await this.coursesRepository.getAllCourses();
	}

	async getCoursesById(id) {
		return await this.coursesRepository.getCourseById(id);
	}

}