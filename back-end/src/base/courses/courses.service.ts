import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CoursesRepository } from 'src/base/courses/courses.repository';
import { CanvasRoomRepository } from '../canvasRoom/canvasRoom.repository';
import { RetrospectivesRepository } from '../retrospectives/retrospectives.repository';

@Injectable()
export class CoursesService {
	constructor(
		@Inject(forwardRef(() => CoursesRepository))
		@Inject(forwardRef(() => RetrospectivesRepository))
		@Inject(forwardRef(() => CanvasRoomRepository))
		private coursesRepository: CoursesRepository,
		private retrospectiveRepository: RetrospectivesRepository,
		private canvasRoomRepository: CanvasRoomRepository
	) {}

	// Business logic methods goes there...
	// Define your own methods

	async getAllCourses() {
		return await this.coursesRepository.getAllCourses();
	}

	async getCoursesById(courseId: string) {
		const courses = await this.coursesRepository.findOne({_id: new ObjectId(courseId)});
		const retro = await this.retrospectiveRepository.findOne({_id: new ObjectId(courses.retro)})
		const canvas = await this.canvasRoomRepository.findManyCanvasRoom({_id: {$in: courses.projects}})

		return {
			course: courses,
			retro: retro,
			projects: canvas
		}
	}

	async createCourse(query) {
		return await this.coursesRepository.createCourse(query);
	}
}
