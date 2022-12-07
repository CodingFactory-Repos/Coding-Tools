import { mongodb } from '@/config/config';
import { Filter, UpdateFilter, FindOneAndUpdateOptions } from 'mongodb';
import { Call } from '../courses/interfaces/courses.interface';

export class CallsRepository {
	static callsCollection = mongodb.collection<Call>('calls');

	get courses() {
		return CallsRepository.callsCollection;
	}

	async createCall(query: Call) {
		return this.courses.insertOne(query);
	}

	async updateOneCall(query: Filter<Call>, update: Partial<Call> | UpdateFilter<Call>) {
		return this.courses.updateOne(query, update);
	}

	async findOneAndUpdateCall(
		query: Filter<Call>,
		update: Partial<Call>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.courses.findOneAndUpdate(query, update, options);
	}

	async callExist(query: Filter<Call>) {
		const options = { projection: { _id: 1 } };
		return this.courses.findOne(query, options);
	}
	// Mongo repo for the courses collection
}
