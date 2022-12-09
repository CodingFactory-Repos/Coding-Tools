import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db } from 'mongodb';

import { Board } from 'src/base/boards/interfaces/boards.interface';

@Injectable()
export class BoardsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get boards() {
		return this.db.collection<Board>('boards');
	}

	async createBoard(query: Board) {
		return this.boards.insertOne(query);
	}

	async updateOneBoard(query: Filter<Board>, update: Partial<Board> | UpdateFilter<Board>) {
		return this.boards.updateOne(query, update);
	}

	async findOneAndUpdateBoard(
		query: Filter<Board>,
		update: Partial<Board>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.boards.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<Board>, options: FindOneAndUpdateOptions = undefined) {
		return this.boards.findOne(query, options);
	}

	async boardExist(query: Filter<Board>) {
		const options = { projection: { _id: 1 } };
		return this.boards.findOne(query, options);
	}
}
