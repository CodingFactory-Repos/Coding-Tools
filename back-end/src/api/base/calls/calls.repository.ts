import { mongodb } from '@/config/config';
import { Filter, UpdateFilter, FindOneAndUpdateOptions } from 'mongodb';
import { Calls } from './interfaces/calls.interface';

export class CallsRepository {
	public callsCollection = mongodb.collection<Calls>('calls');

	get courses() {
		return this.callsCollection;
	}

	async createCall(query: Calls) {
		return this.courses.insertOne(query);
	}

	async updateOneCall(query: Filter<Calls>, update: Partial<Calls> | UpdateFilter<Calls>) {
		return this.courses.updateOne(query, update);
	}

	async findOneAndUpdateCall(
		query: Filter<Calls>,
		update: Partial<Calls>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.courses.findOneAndUpdate(query, update, options);
	}

	async callExist(query: Filter<Calls>) {
		const options = { projection: { _id: 1 } };
		return this.courses.findOne(query, options);
	}
	// Mongo repo for the courses collection
}
