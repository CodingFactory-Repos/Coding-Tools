import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db, ObjectId } from 'mongodb';

import { Sprint } from 'src/base/sprints/interfaces/sprints.interface';
import { Course } from '@/base/courses/interfaces/courses.interface';
import { ServiceError } from '@/common/decorators/catch.decorator';
import crypto from 'crypto';
import { Roles } from '@/base/users/interfaces/users.interface';

@Injectable()
export class SprintsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get groups() {
		return this.db.collection<Sprint>('groups');
	}

	get courses() {
		return this.db.collection<Course>('courses');
	}

	async createGroup(query: Sprint) {
		return this.groups.insertOne(query);
	}

	async updateOneGroup(query: Filter<Sprint>, update: Partial<Sprint> | UpdateFilter<Sprint>) {
		return this.groups.updateOne(query, update);
	}

	async findOneAndUpdateGroup(
		query: Filter<Sprint>,
		update: Partial<Sprint>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.groups.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<Sprint>, options: FindOneAndUpdateOptions = undefined) {
		return this.groups.findOne(query, options);
	}

	async groupExist(query: Filter<Sprint>) {
		const options = { projection: { _id: 1 } };
		return this.groups.findOne(query, options);
	}

	async getActualCourse(userId: ObjectId): Promise<ObjectId | null> {
		const actualDate = new Date();

		const user = await this.db.collection('users').findOne({ _id: userId });
		if (!user) {
			throw new ServiceError('NOT_FOUND', 'User not found');
		}

		const query = {
			periodStart: { $lte: actualDate },
			periodEnd: { $gte: actualDate },
		};

		switch (user.role) {
			case Roles.STUDENT:
				query['classId'] = await this.getStudentClassId(userId);
				break;
			case Roles.PRODUCT_OWNER:
				query['teacherId'] = userId;
				break;
			default:
				throw new Error(`Unknown user role: ${user.role}`);
		}

		const actualCourse = await this.db.collection('courses').findOne(query);
		return actualCourse?._id ?? null;
	}

	async getStudentClassId(userId: ObjectId) {
		const studentClass = await this.db.collection('classes').findOne({
			students: userId,
		});
		return studentClass ? studentClass._id : null;
	}
}
