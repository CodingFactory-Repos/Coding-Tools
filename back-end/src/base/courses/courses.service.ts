import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { CoursesRepository } from 'src/base/courses/courses.repository';
import { UsersRepository } from 'src/base/users/users.repository';

@Injectable()
export class CoursesService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => CoursesRepository))
		private usersRepository: UsersRepository,
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
}
