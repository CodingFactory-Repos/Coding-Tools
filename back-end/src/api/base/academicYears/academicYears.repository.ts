import { mongodb } from '@/config/config';
import { Filter, UpdateFilter, FindOneAndUpdateOptions } from 'mongodb';
import { AcademicYear } from '../users/interfaces/users.interface';
export class AcademicYearsRepository {
	static academicYears = mongodb.collection<AcademicYear>('academicYears');

	get academicYears() {
		return AcademicYearsRepository.academicYears;
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

	async academicYearExist(query: Filter<AcademicYear>) {
		const options = { projection: { _id: 1 } };
		return this.academicYears.findOne(query, options);
	}
	// Mongo repo for the academicYears collection
}
