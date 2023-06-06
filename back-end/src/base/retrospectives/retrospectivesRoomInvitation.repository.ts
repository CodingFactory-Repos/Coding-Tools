import { Inject, Injectable } from '@nestjs/common';
import { Filter, Db, UpdateFilter, FindOneAndUpdateOptions, DeleteOptions } from 'mongodb';

import { RetrospectivesRoomInvitation } from './interfaces/retrospectivesRoomInvitation.interface';

@Injectable()
export class RetrospectivesRoomInvitationRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {
		const collection = this.db.collection<RetrospectivesRoomInvitation>('retrospectives-room-invitation');
		collection.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
	}

	get retrospectivesRoomInvitation() {
		return this.db.collection<RetrospectivesRoomInvitation>('retrospectives-room-invitation');
	}

	async createRetrospectivesRoomInvitation(query: RetrospectivesRoomInvitation) {
		return this.retrospectivesRoomInvitation.insertOne(query);
	}

	async retrospectivesRoomInvitationExist(query: Filter<RetrospectivesRoomInvitation>) {
		const options = { projection: { _id: 1 } };
		return this.retrospectivesRoomInvitation.findOne(query, options);
	}

	async findOneAndUpdateRetrospectivesRoomInvitation(
		query: Filter<RetrospectivesRoomInvitation>,
		update: UpdateFilter<RetrospectivesRoomInvitation>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.retrospectivesRoomInvitation.findOneAndUpdate(query, update, options);
	}

	async deleteOneRetrospectivesRoomInvitation(
		query: Filter<RetrospectivesRoomInvitation>,
		options: DeleteOptions = undefined,
	) {
		return this.retrospectivesRoomInvitation.deleteOne(query, options);
	}
}
