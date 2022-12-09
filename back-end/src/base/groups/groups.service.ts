import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { GroupsRepository } from 'src/base/groups/groups.repository';
import { UsersRepository } from 'src/base/users/users.repository';

@Injectable()
export class GroupsService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => GroupsRepository))
		private usersRepository: UsersRepository,
		private groupsRepository: GroupsRepository,
	) {}

	// Business logic methods goes there...
	// Define your own methods
}
