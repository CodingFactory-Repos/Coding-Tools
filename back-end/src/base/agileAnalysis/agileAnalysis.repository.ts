import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db } from 'mongodb';

import { AgileAnalysis } from 'src/base/AgileAnalysis/interfaces/agileAnalysis.interface';

@Injectable()
export class AgileAnalysisRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get agileAnalysis() {
		return this.db.collection<AgileAnalysis>('agileAnalysis');
	}

	async createAgileAnalysis(query: AgileAnalysis) {
		return this.agileAnalysis.insertOne(query);
	}

	async updateOneAgileAnalysis(
		query: Filter<AgileAnalysis>,
		update: Partial<AgileAnalysis> | UpdateFilter<AgileAnalysis>,
	) {
		return this.agileAnalysis.updateOne(query, update);
	}

	async findOneAndUpdateAgileAnalysis(
		query: Filter<AgileAnalysis>,
		update: Partial<AgileAnalysis>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.agileAnalysis.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<AgileAnalysis>, options: FindOneAndUpdateOptions = undefined) {
		return this.agileAnalysis.findOne(query, options);
	}

	async agileAnalysisExist(query: Filter<AgileAnalysis>) {
		const options = { projection: { _id: 1 } };
		return this.agileAnalysis.findOne(query, options);
	}
}
