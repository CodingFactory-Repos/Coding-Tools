import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db } from 'mongodb';
import { AcademicYear } from 'src/base/users/interfaces/users.interface';

@Injectable()
export class AcademicYearsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get academicYears() {
		return this.db.collection<AcademicYear>('academicYears');
	}

	async createAcademicYear(query: AcademicYear) {
		return this.academicYears.insertOne(query);
	}

	async updateOneAcademicYear(
		query: Filter<AcademicYear>,
		update: Partial<AcademicYear> | UpdateFilter<AcademicYear>,
	) {
		return this.academicYears.updateOne(query, update);
	}

	async findOneAndUpdateAcademicYears(
		query: Filter<AcademicYear>,
		update: Partial<AcademicYear>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.academicYears.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<AcademicYear>, options: FindOneAndUpdateOptions = undefined) {
		return this.academicYears.find(query, options);
	}

	async academicYearExist(query: Filter<AcademicYear>) {
		const options = { projection: { _id: 1 } };
		return this.academicYears.findOne(query, options);
	}
}
