import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { StoriesRepository } from 'src/base/stories/stories.repository';
import { UsersRepository } from 'src/base/users/users.repository';

@Injectable()
export class StoriesService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => StoriesRepository))
		private usersRepository: UsersRepository,
		private storiesRepository: StoriesRepository,
	) {}

	// Business logic methods goes there...
	// Define your own methods
}
