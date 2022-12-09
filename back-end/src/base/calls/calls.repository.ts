import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db } from 'mongodb';

import { Call } from 'src/base/calls/interfaces/calls.interface';

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
}
