import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CoursesRepository } from 'src/base/courses/courses.repository';

@Injectable()
export class CoursesService {
	constructor(
		@Inject(forwardRef(() => CoursesRepository))
		private coursesRepository: CoursesRepository,
	) {}

	async getAllCourses() {
		return await this.coursesRepository.find({});
	}

	async getOneCourse(id: string) {
		return await this.coursesRepository.findOne({ id });
	}

	// Business logic methods goes there...
	// Define your own methods

	async getAllCourses() {
		return await this.coursesRepository.getAllCourses();
	}

	async getCoursesById(id) {
		return await this.coursesRepository.getCourseById(id);
	}

	async createCourse(query) {
		return await this.coursesRepository.createCourse(query);
	}
}