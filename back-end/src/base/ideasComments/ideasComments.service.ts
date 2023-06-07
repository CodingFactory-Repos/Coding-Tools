import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { IdeasCommentsRepository } from 'src/base/ideasComments/ideasComments.repository';
import { UsersRepository } from 'src/base/users/users.repository';

@Injectable()
export class IdeasCommentsService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => IdeasCommentsRepository))
		private usersRepository: UsersRepository,
		private ideasCommentsRepository: IdeasCommentsRepository,
	) {}

	async getAllIdeasComments(query) {
		return this.ideasCommentsRepository.getAllIdeasComments(query);
	}

	async addIdea(queryIdea) {
		return await this.ideasCommentsRepository.createIdeaComment(queryIdea);
	}

	async deleteIdeaComment(query) {
		return await this.ideasCommentsRepository.deleteOneideaComment(query);
	}

	// Business logic methods goes there...
	// Define your own methods
}
