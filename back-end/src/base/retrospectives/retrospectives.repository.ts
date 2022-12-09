import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db } from 'mongodb';

import { Retrospective } from 'src/base/retrospectives/interfaces/retrospectives.interface';

@Injectable()
export class RetrospectivesRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get retrospectives() {
		return this.db.collection<Retrospective>('retrospectives');
	}

	async createRetrospective(query: Retrospective) {
		return this.retrospectives.insertOne(query);
	}

	async updateOneRetrospective(
		query: Filter<Retrospective>,
		update: Partial<Retrospective> | UpdateFilter<Retrospective>,
	) {
		return this.retrospectives.updateOne(query, update);
	}

	async findOneAndUpdateRetrospective(
		query: Filter<Retrospective>,
		update: Partial<Retrospective>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.retrospectives.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<Retrospective>, options: FindOneAndUpdateOptions = undefined) {
		return this.retrospectives.findOne(query, options);
	}

	async retrospectiveExist(query: Filter<Retrospective>) {
		const options = { projection: { _id: 1 } };
		return this.retrospectives.findOne(query, options);
	}
	// Mongo repo for the retrospectives collection
}
