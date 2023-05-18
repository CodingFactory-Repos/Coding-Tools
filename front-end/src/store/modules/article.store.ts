import { Article, ArticleStore } from '../interfaces/article.interface';
import { defineStore } from 'pinia';
import { http } from '@/api/network/axios';
import { withErrorHandler } from '@/utils/storeHandler';

export const useArticleStore = defineStore('article', {
	state: (): ArticleStore => {
		return {
			items: [
				{
					_id: '',
					date: '',
					title: '',
					descriptions: '',
					picture: '',
					tags: '',
					type: '',
				},
			],
			oneItems: {
				_id: '',
				title: '',
				date: '',
				descriptions: '',
				picture: '',
				tags: '',
				type: '',
				participants: [
					{
						firstName: '',
						lastName: '',
						email: '',
					},
				],
				comments: [
					{
						email: '',
						firstName: '',
						lastName: '',
						title: '',
						descriptions: [
							{
								value: '',
							},
						],
						date: new Date(),
					},
				],
			},
			idArticle: '',
		};
	},
	actions: {
		//add article to store and to the database
		addArticle: withErrorHandler(async function (this: ArticleStore, article: Article) {
			const res = await http.post('/articles/add', article);
			const idArticle = res.data.id;
			this.idArticle = idArticle;
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

		// add participant to the array of participants in article in the database
		addParticipant: withErrorHandler(async function (id: string, participant) {
			const response = await http.put(`/articles/participant/${id}`, participant);
			const oneItems = response.data;
			this.oneItems = oneItems;
			return true;
		}),

		// remove participant from the array of participants in article in the database
		removeParticipant: withErrorHandler(async function (id: string, participant) {
			const response = await http.put(`/articles/removeParticipant/${id}`, participant);
			const oneItems = response.data;
			this.oneItems = oneItems;
			return true;
		}),

		addComment: withErrorHandler(async function (id: string, comment) {
			const response = await http.put(`/articles/comment/${id}`, comment);
			const oneItems = response.data;
			this.oneItems = oneItems;
			return true;
		}),
	},
});
