import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { SprintsRepository } from 'src/base/sprints/sprints.repository';
import { UsersRepository } from 'src/base/users/users.repository';

@Injectable()
export class SprintsService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => SprintsRepository))
		private usersRepository: UsersRepository,
		private groupsRepository: SprintsRepository,
	) {}

	// Business logic methods goes there...
	// Define your own methods
}
