import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db, ObjectId } from 'mongodb';

import { IdeaComment } from 'src/base/ideasComments/interfaces/ideasComments.interface';

@Injectable()
export class IdeasCommentsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get ideasComments() {
		return this.db.collection<IdeaComment>('ideasComments');
	}

	async getAllIdeasComments(query: IdeaComment) {
		const { equipmentId } = query;
		return await this.ideasComments
			.aggregate([
				{ $match: { equipmentId: new ObjectId(equipmentId) } },
				{
					$lookup: {
						from: 'users',
						localField: 'userId',
						foreignField: '_id',
						as: 'user',
					},
				},
			])
			.toArray();
	}

	async createIdeaComment(query: IdeaComment) {
		const { equipmentId, userId } = query;
		await this.ideasComments.insertOne({
			...query,
			equipmentId: new ObjectId(equipmentId),
			userId: new ObjectId(userId),
			date: new Date(),
		});
		return this.ideasComments
			.aggregate([
				{ $match: { equipmentId: new ObjectId(equipmentId) } },
				{
					$lookup: {
						from: 'users',
						localField: 'userId',
						foreignField: '_id',
						as: 'user',
					},
				},
			])
			.toArray();
	}

	async updateOneIdeaComment(
		query: Filter<IdeaComment>,
		update: Partial<IdeaComment> | UpdateFilter<IdeaComment>,
	) {
		return this.ideasComments.updateOne(query, update);
	}

	async findOneAndUpdateIdeaComment(
		query: Filter<IdeaComment>,
		update: Partial<IdeaComment>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.ideasComments.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<IdeaComment>, options: FindOneAndUpdateOptions = undefined) {
		return this.ideasComments.findOne(query, options);
	}

	async ideaCommentExist(query: Filter<IdeaComment>) {
		const options = { projection: { _id: 1 } };
		return this.ideasComments.findOne(query, options);
	}

	async deleteOneideaComment(query: Filter<IdeaComment>) {
		return this.ideasComments.deleteOne(query);
	}
}
