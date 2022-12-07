import { mongodb } from '@/config/config';
import { ObjectId, Filter, UpdateFilter, FindOneAndUpdateOptions } from 'mongodb';
import { Retrospective } from './interfaces/retrospectives.interface';

export class RetrospectiveRepository {
	static retrospectiveCollection = mongodb.collection<Retrospective>('retrospectives');

	get retrospectives() {
		return RetrospectiveRepository.retrospectiveCollection;
	}

	async createRetrospective(query: Retrospective) {
		return this.retrospectives.insertOne(query);
	}

	async updateOneRetrospective(query: Filter<Retrospective>, update: Partial<Retrospective> | UpdateFilter<Retrospective>) {
		return this.retrospectives.updateOne(query, update);
	}

	async findOneAndUpdateRetrospective(
		query: Filter<Retrospective>,
		update: Partial<Retrospective>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.retrospectives.findOneAndUpdate(query, update, options);
	}

	async retrospectiveExist(query: Filter<Retrospective>) {
		const options = { projection: { _id: 1 } };
		return this.retrospectives.findOne(query, options)
	}
	// Mongo repo for the retrospectives collection
}
