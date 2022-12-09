import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db } from 'mongodb';

import { Group } from 'src/base/groups/interfaces/groups.interface';

@Injectable()
export class GroupsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get groups() {
		return this.db.collection<Group>('groups');
	}

	async createGroup(query: Group) {
		return this.groups.insertOne(query);
	}

	async updateOneGroup(query: Filter<Group>, update: Partial<Group> | UpdateFilter<Group>) {
		return this.groups.updateOne(query, update);
	}

	async findOneAndUpdateGroup(
		query: Filter<Group>,
		update: Partial<Group>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.groups.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<Group>, options: FindOneAndUpdateOptions = undefined) {
		return this.groups.findOne(query, options);
	}

	async groupExist(query: Filter<Group>) {
		const options = { projection: { _id: 1 } };
		return this.groups.findOne(query, options);
	}
}
