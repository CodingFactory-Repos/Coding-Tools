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
	isStudentLate(period, timeOfScan) {
		if (period === 'arrival') {
			const fakeDate = new Date('2023-03-23T08:00:00.105Z');
			if (!(timeOfScan < 9 * 60 * 60 * 1000)) {
				const minutesOfLate = Math.floor(
					Math.floor(timeOfScan.getTime() - fakeDate.getTime()) / 1000 / 60,
				);
				const hoursOfLate = Math.floor(minutesOfLate / 60);
				const minutesOfLateConverted = minutesOfLate % 60;
				return [true, `${hoursOfLate}h${minutesOfLateConverted}`];
			}
		}
		return false;
	}

	didStudentLeftEarly(period, timeOfScan) {
		if (period === 'departure') {
			const fakeDate = new Date('2023-03-23T16:00:00.105Z');
			if (timeOfScan.getHours() == 16 && timeOfScan.getMinutes() < 50) {
				const minutesOfLate = Math.floor(
					Math.floor(fakeDate.getTime() - timeOfScan.getTime()) / 1000 / 60,
				);
				const hoursOfEarly = Math.floor(minutesOfLate / 60);
				const minutesOfEarlyConverted = minutesOfLate % 60;
				return [true, `${hoursOfEarly}h${minutesOfEarlyConverted}`];
			}
		}
		return false;
	}

	async getActualCourse(userId: ObjectId) {
		const actualDate = new Date();
		const classId = await this.getStudentClassId(userId);
		const actualCourse = await this.db.collection('courses').findOne({
			classId: classId,
			periodStart: { $lte: actualDate },
			periodEnd: { $gte: actualDate },
		});
		return actualCourse ? actualCourse._id : null;
	}
	async getStudentClassId(userId: ObjectId) {
		const studentClass = await this.db.collection('classes').findOne({
			students: userId,
		});
		return studentClass ? studentClass._id : null;
	}

	async getStudentList(courseId: string) {
		const courseObjectId = new ObjectId(courseId);
		const course = await this.db.collection('courses').findOne({ _id: courseObjectId });
		const classId = course.classId;
		const classroom = await this.db.collection('classes').findOne({ _id: classId });

		return classroom.students;
	}
}
