import { ServiceError } from '@/common/decorators/catch.decorator';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { GroupsRepository } from 'src/base/groups/groups.repository';
import { UsersRepository } from 'src/base/users/users.repository';
import { CoursesRepository } from '../courses/courses.repository';

@Injectable()
export class GroupsService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => GroupsRepository))
		@Inject(forwardRef(() => CoursesRepository))
		private usersRepository: UsersRepository,
		private groupsRepository: GroupsRepository,
		private coursesRepository: CoursesRepository,
	) { }
}
