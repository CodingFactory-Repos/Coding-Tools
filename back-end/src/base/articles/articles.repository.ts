import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db, ObjectId } from 'mongodb';

import { Article } from 'src/base/articles/interfaces/articles.interface';

@Injectable()
export class ArticlesRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	// Function to get the articles collection
	get articles() {
		return this.db.collection<Article>('articles');
	}

	// Function to get an article by its id
	async getArticleById(id: ObjectId) {
		id = new ObjectId(id);
		return this.articles.findOne({ _id: id });
	}

	// Function to get all articles
	async getAllArticles() {
		return this.articles.find({}).toArray();
	}

	// Function to add an article
	async createArticle(query: Article) {
		return this.articles.insertOne(query);
	}

	// Function to delete an article
	async deleteOneArticle(id: ObjectId) {
		return this.articles.deleteOne({ _id: new ObjectId(id) });
	}

	async updateOneArticle(query: Filter<Article>, update: Partial<Article> | UpdateFilter<Article>) {
		this.articles.updateOne(query, update);
		return this.articles.findOne(query);
	}

	async findOneAndUpdateArticle(
		query: Filter<Article>,
		update: Partial<Article>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.articles.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<Article>, options: FindOneAndUpdateOptions = undefined) {
		return this.articles.findOne(query, options);
	}

	async articleExist(query: Filter<Article>) {
		const options = { projection: { _id: 1 } };
		return this.articles.findOne(query, options);
	}

	async updateMany(query: Filter<Article>, update: Partial<Article>) {
		return this.articles.updateMany(query, { $set: update });
	}
	// Mongo repo for the articles collection
}
