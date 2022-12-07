import { mongodb } from '@/config/config';
import { ObjectId, Filter, UpdateFilter, FindOneAndUpdateOptions } from 'mongodb';
import { Board } from './interfaces/boards.interface';

export class BoardsRepository {
	static boardsCollection = mongodb.collection<Board>('boards');

	get boards() {
		return BoardsRepository.boardsCollection;
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

	async boardExist(query: Filter<Board>) {
		const options = { projection: { _id: 1 } };
		return this.boards.findOne(query, options);
	}
	// Mongo repo for the boards collection
}
