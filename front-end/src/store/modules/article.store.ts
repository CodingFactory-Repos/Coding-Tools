import { Article, ArticleStore } from '../interfaces/article.interface';
import { defineStore } from 'pinia';
import { http } from '@/api/network/axios';
import { withErrorHandler } from '@/utils/storeHandler';

export const useArticleStore = defineStore('article', {
	state: (): ArticleStore => {
		return {
			items: [
				{
					title: '',
					descriptions: [
						{
							type: '',
							value: '',
						},
					],
					picture: '',
					tags: '',
					type: '',
				},
			],
			oneItems: {
				title: '',
				descriptions: [
					{
						type: '',
						value: '',
					},
				],
				picture: '',
				tags: '',
				type: '',
			},
		};
	},
	actions: {
		//add article to store and to the database
		addArticle: withErrorHandler(async function (this: ArticleStore, article: Article) {
			this.items.push(article);

			await http.post('/articles/add', article);
		}),

		//get article from the database
		getArticle: withErrorHandler(async function () {
			const response = await http.get('/articles');
			const items = response.data;
			this.items = items;
			return true;
		}),

		//get article by id from the database
		getArticleById: withErrorHandler(async function (id: string) {
			const response = await http.get(`/articles/${id}`);
			const oneItems = response.data;
			this.oneItems = oneItems;
			return true;
		}),
	},
});
