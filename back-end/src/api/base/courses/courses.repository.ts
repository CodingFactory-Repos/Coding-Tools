import { mongodb } from '@/config/config';
import { ObjectId, Filter, UpdateFilter, FindOneAndUpdateOptions } from 'mongodb';
import { Course } from './interfaces/courses.interface';

export class CoursesRepository {
	static coursesCollection = mongodb.collection<Course>('courses');

	get courses() {
		return CoursesRepository.coursesCollection;
	}

	async createCourse(query: Course) {
		return this.courses.insertOne(query);
	}

	async updateOneCourse(query: Filter<Course>, update: Partial<Course> | UpdateFilter<Course>) {
		return this.courses.updateOne(query, update);
	}

	async findOneAndUpdateCourse(
		query: Filter<Course>,
		update: Partial<Course>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.courses.findOneAndUpdate(query, update, options);
	}

	async CourseExist(query: Filter<Course>) {
		const options = { projection: { _id: 1 } };
		return this.courses.findOne(query, options);
	}
	// Mongo repo for the courses collection
}
