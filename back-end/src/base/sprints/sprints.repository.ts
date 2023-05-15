import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db } from 'mongodb';

import { Sprint } from 'src/base/sprints/interfaces/sprints.interface';

@Injectable()
export class SprintsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get groups() {
		return this.db.collection<Sprint>('groups');
	}

	async createGroup(query: Sprint) {
		return this.groups.insertOne(query);
	}

	async updateOneGroup(query: Filter<Sprint>, update: Partial<Sprint> | UpdateFilter<Sprint>) {
		return this.groups.updateOne(query, update);
	}

	async findOneAndUpdateGroup(
		query: Filter<Sprint>,
		update: Partial<Sprint>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.groups.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<Sprint>, options: FindOneAndUpdateOptions = undefined) {
		return this.groups.findOne(query, options);
	}

	async groupExist(query: Filter<Sprint>) {
		const options = { projection: { _id: 1 } };
		return this.groups.findOne(query, options);
	}
}
