import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db, ObjectId } from 'mongodb';
import { Call } from 'src/base/calls/interfaces/calls.interface';
import { Course } from '@/base/courses/interfaces/courses.interface';

@Injectable()
export class CallsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get calls() {
		return this.db.collection<Call>('calls');
	}
	get courses() {
		return this.db.collection<Course>('courses');
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
	async updateUserPresence(userId: ObjectId, courseId: string, presence: boolean) {
		const courseObjectId = new ObjectId(courseId);
		const userObjectId = new ObjectId(userId);
		const course = await this.db.collection('courses').findOne({ _id: courseObjectId });
		const user = await this.db.collection('users').findOne({ _id: userObjectId });
		const date = new Date();
		const period = ['arrival', 'departure'];

		const periodIndex = date.getHours() < 16 ? 0 : 1;
		const call = await this.db
			.collection('calls')
			.findOne({ course: courseObjectId, period: period[periodIndex] });

		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (!course) {
			throw new NotFoundException('Course not found');
		}
		if (!call) {
			// Create a new call if one does not already exist
			await this.db.collection('calls').insertOne({
				course: courseObjectId,
				period: period[periodIndex],
				students: [],
			});
		} else if (call.students.find((student) => student.student == userId)) {
			return {
				message: 'User already registered',
			};
		}

		// Update the call with the student's presence
		await this.db.collection('calls').updateOne(
			{ course: courseObjectId, period: period[periodIndex] },
			{
				$push: {
					students: {
						student: userObjectId,
						presence: presence,
						late: this.isStudentLate(period[periodIndex], date),
						leftEarly: this.didStudentLeftEarly(period[periodIndex], date),
					},
				},
			},
		);

		return {
			message: 'User presence updated successfully',
		};
	}
	isStudentLate(period, timeOfScan) {
		const fakeDate = new Date(
			timeOfScan.getFullYear(),
			timeOfScan.getMonth(),
			timeOfScan.getDate(),
			9,
			0,
			0,
			0,
		);
		if (period === 'arrival') {
			if (timeOfScan >= 9 * 60 * 60 * 1000) {
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
			const fakeDate = new Date(
				timeOfScan.getFullYear(),
				timeOfScan.getMonth(),
				timeOfScan.getDate(),
				17,
				0,
				0,
				0,
			);
			if (timeOfScan.getHours() == 14 && timeOfScan.getMinutes() < 50) {
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

	async getStudentIdList(courseId: string) {
		const courseObjectId = new ObjectId(courseId);
		const course = await this.db.collection('courses').findOne({ _id: courseObjectId });
		const classId = course.classId;
		const classroom = await this.db.collection('classes').findOne({ _id: classId });

		return classroom.students;
	}
	async getStudentList(studentIdList: Array<ObjectId>) {
		const studentList = await this.db
			.collection('users')
			.find({ _id: { $in: studentIdList } })
			.toArray();
		return studentList;
	}

	async createGroups(groups: Array<Array<ObjectId>>, courseId: string) {
		const courseObjectId = new ObjectId(courseId);
		const actualDate = new Date();
		const course = await this.db.collection('courses').findOne({
			_id: courseObjectId,
			periodStart: { $lte: actualDate },
			periodEnd: { $gte: actualDate },
		});
		if (!course) {
			throw new NotFoundException('Course not found');
		}
		if (!course.groups) {
			await this.db.collection('courses').updateOne(
				{ _id: courseObjectId, periodStart: { $lte: actualDate }, periodEnd: { $gte: actualDate } },
				{
					$set: {
						groups: groups,
					},
				},
			);
		}
		return {
			message: 'Groups updated successfully',
		};
	}

	// async updateGroups(groups: Array<Array<ObjectId>>, courseId: string) {}
}
