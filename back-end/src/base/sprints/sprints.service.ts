import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { SprintsRepository } from 'src/base/sprints/sprints.repository';
import { UsersRepository } from 'src/base/users/users.repository';

import { ObjectId } from 'mongodb';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SprintsService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => SprintsRepository))
		private usersRepository: UsersRepository,
		private SprintsRepository: SprintsRepository,
	) {}

	async getActualCourse(userId: ObjectId) {
		const actualCourse = await this.SprintsRepository.getActualCourse(userId);
		return actualCourse;
	}
}
