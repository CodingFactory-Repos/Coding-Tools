import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { ArticlesRepository } from 'src/base/articles/articles.repository';
import { UsersRepository } from 'src/base/users/users.repository';

@Injectable()
export class ArticlesService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => ArticlesRepository))
		private usersRepository: UsersRepository,
		private articlesRepository: ArticlesRepository,
	) {}

	async addArticle(queryArticle) {
		return await this.articlesRepository.createArticle(queryArticle);
	}
	// Business logic methods goes there...
	// Define your own methods
}
