import { mongodb } from '@/config/config';
import { ObjectId, Filter, UpdateFilter, FindOneAndUpdateOptions } from 'mongodb';
import { AgileAnalysis } from './interfaces/agileAnalysis.interface';

export class AgileAnalysisRepository {
	static agileAnalysisCollection = mongodb.collection<AgileAnalysis>('agileAnalysis');

	get agileAnalysis() {
		return AgileAnalysisRepository.agileAnalysisCollection;
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

	async agileAnalysisExist(query: Filter<AgileAnalysis>) {
		const options = { projection: { _id: 1 } };
		return this.agileAnalysis.findOne(query, options);
	}
	// Mongo repo for the agileAnalysis collection
}
