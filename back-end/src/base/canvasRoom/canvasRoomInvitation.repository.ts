import { Inject, Injectable } from '@nestjs/common';
import { Filter, Db, UpdateFilter, FindOneAndUpdateOptions, DeleteOptions } from 'mongodb';

import { CanvasRoomInvitation } from '@/base/canvasRoom/interfaces/canvasRoomInvitation.interface';

@Injectable()
export class CanvasRoomInvitationRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {
		const collection = this.db.collection<CanvasRoomInvitation>('canvas-room-invitation');
		collection.createIndex({ "expireAt": 1 }, { expireAfterSeconds: 0 });
	}

	get canvasRoomInvitation() {
		return this.db.collection<CanvasRoomInvitation>('canvas-room-invitation');
	}

	async createCanvasRoomInvitation(query: CanvasRoomInvitation) {
		return this.canvasRoomInvitation.insertOne(query);
	}

	async canvasRoomInvitationExist(query: Filter<CanvasRoomInvitation>) {
		const options = { projection: { _id: 1 } };
		return this.canvasRoomInvitation.findOne(query, options);
	}

	async findOneAndUpdateCanvasRoomInvitation(
		query: Filter<CanvasRoomInvitation>,
		update: UpdateFilter<CanvasRoomInvitation>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.canvasRoomInvitation.findOneAndUpdate(query, update, options);
	}

	async deleteOneCanvasRoomInvitation(query: Filter<CanvasRoomInvitation>, options: DeleteOptions = undefined) {
		return this.canvasRoomInvitation.deleteOne(query, options);
	}
}
