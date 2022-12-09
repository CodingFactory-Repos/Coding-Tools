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

	// Business logic methods goes there...
	// Define your own methods
}
