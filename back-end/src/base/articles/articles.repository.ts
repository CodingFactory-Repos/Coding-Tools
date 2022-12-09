import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db } from 'mongodb';

import { Article } from 'src/base/articles/interfaces/articles.interface';

@Injectable()
export class ArticlesRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get articles() {
		return this.db.collection<Article>('articles');
	}

	async createArticle(query: Article) {
		return this.articles.insertOne(query);
	}

	async updateOneArticle(query: Filter<Article>, update: Partial<Article> | UpdateFilter<Article>) {
		return this.articles.updateOne(query, update);
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
	// Mongo repo for the articles collection
}
