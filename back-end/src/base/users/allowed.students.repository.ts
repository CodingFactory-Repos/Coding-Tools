import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, FindOptions, Db } from 'mongodb';
import { AllowedStudent } from '@/base/users/interfaces/allowed.students.interface';

@Injectable()
export class AllowedStudentsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get allowedStudents() {
		return this.db.collection<AllowedStudent>('allowedStudents');
	}

	async createAllowedStudent(query: AllowedStudent) {
		return this.allowedStudents.insertOne(query);
	}

	async updateOneAllowedStudent(query: Filter<AllowedStudent>, update: Partial<AllowedStudent> | UpdateFilter<AllowedStudent>) {
		return this.allowedStudents.updateOne(query, update);
	}

	async findOneAndUpdateAllowedStudent(
		query: Filter<AllowedStudent>,
		update: UpdateFilter<AllowedStudent>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.allowedStudents.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<AllowedStudent>, options: FindOptions<AllowedStudent> = undefined) {
		return this.allowedStudents.findOne(query, options);
	}

	async allowedStudentExist(query: Filter<AllowedStudent>) {
		const options = { projection: { _id: 1 } };
		return this.allowedStudents.findOne(query, options);
	}

	async findMany(query: Filter<AllowedStudent>, options: FindOptions<AllowedStudent> = undefined) {
		return this.allowedStudents.find(query, options).toArray();
	}
}
