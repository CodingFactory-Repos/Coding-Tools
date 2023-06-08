import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

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

	// Function to add an article
	async addArticle(queryArticle) {
		return await this.articlesRepository.createArticle(queryArticle);
	}

	// Function to get all articles
	async getArticle() {
		return await this.articlesRepository.getAllArticles();
	}

	// Function to get an article by its id
	async getArticleById(id) {
		return await this.articlesRepository.getArticleById(id);
	}

	// add participant to the array of participants in article in the database
	async addParticipant(id, queryParticipant) {
		const update = { $push: { participants: queryParticipant } };

		return await this.articlesRepository.updateOneArticle({ _id: new ObjectId(id) }, update);
	}

	async getArticleWithMostParticipants() {
		const res = await this.articlesRepository.articles
			.aggregate([
				{
					$project: {
						_id: 1,
						participants: 1,
						numParticipants: { $size: '$participants' },
					},
				},
				{
					$sort: { numParticipants: -1 },
				},
				{
					$limit: 5,
				},
			])
			.toArray();

		return res;
	}

	// remove participant from the array of participants in article in the database
	async removeParticipant(id, queryParticipant) {
		const update = { $pull: { participants: queryParticipant } };

		return await this.articlesRepository.updateOneArticle({ _id: new ObjectId(id) }, update);
	}

	// add comment
	async addComment(id, queryComment) {
		const update = { $push: { comments: queryComment } };

		return await this.articlesRepository.updateOneArticle({ _id: new ObjectId(id) }, update);
	}

	// Business logic methods goes there...
	// Define your own methods
}
