import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db, ObjectId } from 'mongodb';

import { Course } from 'src/base/courses/interfaces/courses.interface';

@Injectable()
export class CoursesRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get courses() {
		return this.db.collection<Course>('courses');
	}

	async getAllCourses() {
		return this.courses.find().toArray();
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

	async findOne(query: Filter<Course>, options: FindOneAndUpdateOptions = undefined) {
		return this.courses.findOne(query, options);
	}

	async courseExist(query: Filter<Course>) {
		const options = { projection: { _id: 1 } };
		return this.courses.findOne(query, options);
	}

	async getCourseById(id: ObjectId) {
		id = new ObjectId(id);
		return this.courses.findOne({ _id: id });
	}
}
