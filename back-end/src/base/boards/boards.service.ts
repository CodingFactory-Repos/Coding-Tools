import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { BoardsRepository } from 'src/base/boards/boards.repository';
import { UsersRepository } from 'src/base/users/users.repository';

@Injectable()
export class BoardsService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => BoardsRepository))
		private usersRepository: UsersRepository,
		private boardsRepository: BoardsRepository,
	) {}

	async getBoards() {
		return await this.boardsRepository.getBoards();
	}

	async getBoardByProjectId(id) {
		return await this.boardsRepository.getBoardByProjectId(id);
	}

	// Function to add an article
	async createBoard(query) {
		return await this.boardsRepository.createBoard(query);
	}

	async deleteBoardById(id) {
		return await this.boardsRepository.deleteOneBoard(id);
	}

}
