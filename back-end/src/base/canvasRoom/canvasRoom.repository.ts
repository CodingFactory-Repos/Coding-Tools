import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db, FindOptions, DeleteOptions } from 'mongodb';

import { CanvasRoom } from '@/base/canvasRoom/interfaces/canvasRoom.interface';

@Injectable()
export class CanvasRoomRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get canvasRoom() {
		return this.db.collection<CanvasRoom>('canvas-room');
	}

	async createCanvasRoom(query: CanvasRoom) {
		return this.canvasRoom.insertOne(query);
	}

	async updateOneCanvasRoom(
		query: Filter<CanvasRoom>,
		update: Partial<CanvasRoom> | UpdateFilter<CanvasRoom>,
	) {
		return this.canvasRoom.updateOne(query, update);
	}

	async findOneAndUpdateCanvasRoom(
		query: Filter<CanvasRoom>,
		update: UpdateFilter<CanvasRoom>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.canvasRoom.findOneAndUpdate(query, update, options);
	}

	async findOneCanvasRoom(query: Filter<CanvasRoom>, options: FindOneAndUpdateOptions = undefined) {
		return this.canvasRoom.findOne(query, options);
	}

	async canvasRoomExist(query: Filter<CanvasRoom>) {
		const options = { projection: { _id: 1 } };
		return this.canvasRoom.findOne(query, options);
	}

	async findManyCanvasRoom(query: Filter<CanvasRoom>, options: FindOptions<Document> = undefined) {
		return this.canvasRoom.find(query, options).toArray();
	}

	async deleteOneCanvasRoom(query: Filter<CanvasRoom>, options: DeleteOptions = undefined) {
		return this.canvasRoom.deleteOne(query, options);
	}
}
