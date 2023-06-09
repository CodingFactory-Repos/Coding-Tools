import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { ArticlesRepository } from 'src/base/articles/articles.repository';
import { UsersRepository } from 'src/base/users/users.repository';
import { NewTutorialEmitter } from '@/base/articles/events/newTutorial.events';

@Injectable()
export class ArticlesService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => ArticlesRepository))
		private usersRepository: UsersRepository,
		private articlesRepository: ArticlesRepository,
		private newTutorialEmitter: NewTutorialEmitter,
	) {}

	// Function to add an article
	async addArticle(queryArticle) {
		queryArticle.status = 'Pending';

		// add new object id to id
		queryArticle._id = new ObjectId();

		queryArticle.owner = new ObjectId(queryArticle.owner);
		queryArticle.date = new Date(queryArticle.date);
		queryArticle.updatedAt = new Date();

		// send mail logic
		// trigger event to send mail to POs/Pedagos
		if (queryArticle.type == 'Tuto') {
			// request to get all POs/Pedagos
			const mailTargets = await this.usersRepository.findMany({
				role: { $in: [2, 3] },
			});

			// format mails for recipients
			const recipientsMails: { Email: string }[] = mailTargets
				.map((item) => item.profile.email)
				.map((mail) => {
					return { Email: mail };
				});

			// emit mail
			this.newTutorialEmitter.newTutorialMail(recipientsMails);
		}

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

	// Function to update an article
	async updateArticle(id, queryArticle) {
		queryArticle.$set = queryArticle.$set || {};
		queryArticle.$set.date = new Date(queryArticle.$set.date);
		queryArticle.$set.updatedAt = new Date();

		return await this.articlesRepository.updateOneArticle({ _id: new ObjectId(id) }, queryArticle);
	}

	// add participant to the array of participants in article in the database
	async addParticipant(id, queryParticipant) {
		queryParticipant._id = new ObjectId(queryParticipant._id);
		const update = { $push: { participants: queryParticipant } };

		return await this.articlesRepository.updateOneArticle({ _id: new ObjectId(id) }, update);
	}

	// remove participant from the array of participants in article in the database
	async removeParticipant(id, queryParticipant) {
		queryParticipant._id = new ObjectId(queryParticipant._id);
		const update = { $pull: { participants: queryParticipant } };

		return await this.articlesRepository.updateOneArticle({ _id: new ObjectId(id) }, update);
	}

	// add like to the array of likes in article in the database
	async addLike(id, queryLike) {
		queryLike.id = new ObjectId(queryLike.id);
		const update = { $push: { likes: queryLike } };

		return await this.articlesRepository.updateOneArticle({ _id: new ObjectId(id) }, update);
	}

	// remove like from the array of likes in article in the database
	async removeLike(id, queryLike) {
		queryLike.id = new ObjectId(queryLike.id);
		const update = { $pull: { likes: queryLike } };

		return await this.articlesRepository.updateOneArticle({ _id: new ObjectId(id) }, update);
	}

	// add dislike to the array of dislikes in article in the database
	async addDislike(id, queryDislike) {
		queryDislike.id = new ObjectId(queryDislike.id);
		const update = { $push: { dislikes: queryDislike } };

		return await this.articlesRepository.updateOneArticle({ _id: new ObjectId(id) }, update);
	}

	// remove dislike from the array of dislikes in article in the database
	async removeDislike(id, queryDislike) {
		queryDislike.id = new ObjectId(queryDislike.id);
		const update = { $pull: { dislikes: queryDislike } };

		return await this.articlesRepository.updateOneArticle({ _id: new ObjectId(id) }, update);
	}

	// add comment
	async addComment(id, queryComment) {
		queryComment._id = new ObjectId();
		const update = { $push: { comments: queryComment } };

		return await this.articlesRepository.updateOneArticle({ _id: new ObjectId(id) }, update);
	}

	// remove comment
	async removeComment(id, queryComment) {
		queryComment._id = new ObjectId(queryComment._id);
		const update = { $pull: { comments: queryComment } };

		return await this.articlesRepository.updateOneArticle({ _id: new ObjectId(id) }, update);
	}

	// delete article
	async deleteArticle(id) {
		return await this.articlesRepository.deleteOneArticle(id);
	}

	// updates many articles at a time (used for cron task)
	async updateManyArticles(query, updateParams) {
		return await this.articlesRepository.updateMany(query, updateParams);
	}
	// Business logic methods goes there...
	// Define your own methods
}
