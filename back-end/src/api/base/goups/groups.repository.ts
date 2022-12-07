import { mongodb } from '@/config/config';
import { ObjectId, Filter, UpdateFilter, FindOneAndUpdateOptions } from 'mongodb';
import { Group } from './interfaces/groups.interface';

export class GroupsRepository {
	static groupCollection = mongodb.collection<Group>('groups');

	get groups() {
		return GroupsRepository.groupCollection;
	}

	async createRetrospective(query: Group) {
		return this.groups.insertOne(query);
	}

	async updateOneRetrospective(query: Filter<Group>, update: Partial<Group> | UpdateFilter<Group>) {
		return this.groups.updateOne(query, update);
	}

	async findOneAndUpdateRetrospective(
		query: Filter<Group>,
		update: Partial<Group>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.groups.findOneAndUpdate(query, update, options);
	}

	async retrospectiveExist(query: Filter<Group>) {
		const options = { projection: { _id: 1 } };
		return this.groups.findOne(query, options);
	}
	// Mongo repo for the groups collection
}
