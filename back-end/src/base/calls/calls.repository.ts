import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db } from 'mongodb';

import { Call } from 'src/base/calls/interfaces/calls.interface';
import { ObjectId } from 'mongodb';

@Injectable()
export class CallsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get calls() {
		return this.db.collection<Call>('calls');
	}

	async createCall(query: Call) {
		return this.calls.insertOne(query);
	}

	async updateOneCall(query: Filter<Call>, update: Partial<Call> | UpdateFilter<Call>) {
		return this.calls.updateOne(query, update);
	}

	async findOneAndUpdateCall(
		query: Filter<Call>,
		update: Partial<Call>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.calls.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<Call>, options: FindOneAndUpdateOptions = undefined) {
		return this.calls.findOne(query, options);
	}

	async callExist(query: Filter<Call>) {
		const options = { projection: { _id: 1 } };
		return this.calls.findOne(query, options);
	}
	async updateUserPresence(userId: ObjectId, courseId: ObjectId, presence: boolean) {
		const course = await this.db.collection('courses').findOne({ _id: courseId });
		const user = await this.db.collection('users').findOne({ _id: userId });

		if (!course) {
			throw new NotFoundException('Course not found');
		}

		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (!course.students.includes(userId.toHexString())) {
			throw new BadRequestException('User is not registered in this course');
		}

		const query = {
			course_id: courseId,
			user_id: userId,
		};
		const update = {
			$set: {
				present: presence,
			},
		};

		await this.calls.updateOne(query, update);

		return {
			message: 'User presence updated successfully',
		};
	}
}
