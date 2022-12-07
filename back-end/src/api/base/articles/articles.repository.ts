import { mongodb } from '@/config/config';
import { ObjectId, Filter, UpdateFilter, FindOneAndUpdateOptions } from 'mongodb';
import { Article } from './interfaces/articles.interface';

export class ArticlesRepository {
	static ArticlesCollection = mongodb.collection<Article>('articles');

	get articles() {
		return ArticlesRepository.ArticlesCollection;
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

	async ArticleExist(query: Filter<Article>) {
		const options = { projection: { _id: 1 } };
		return this.articles.findOne(query, options);
	}
	// Mongo repo for the articles collection
}
