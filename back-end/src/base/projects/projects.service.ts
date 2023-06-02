import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { ProjectsRepository } from 'src/base/projects/projects.repository';
import { UsersRepository } from 'src/base/users/users.repository';

@Injectable()
export class ProjectsService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => ProjectsRepository))
		private usersRepository: UsersRepository,
		private projectsRepository: ProjectsRepository,
	) {}

	// Business logic methods goes there...
	// Define your own methods
}
