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
				_id: '',
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
			return items;
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

		getParticipants: withErrorHandler(async function (id: string) {
			const response = await http.get(`/articles/participant/${id}`);
			const participants = response.data.map((participant) => participant._id);
			return participants;
		}),

		getArticleWithMostParticipants: withErrorHandler(async function () {
			const response = await http.get('articles/stats/participant');
			const participants = response.data.map((participant) => participant._id);
			return participants;
		}),

		getTopCreateur: withErrorHandler(async function () {
			try {
				const response = await http.get('/articles/stats/topcreateur');
				const topCreators = Array.isArray(response.data) ? response.data : [];
				console.log(topCreators);
			} catch (error) {
				console.error(error);
			}
		}),

		getTopParticipant: withErrorHandler(async function () {
			const response = await http.get('articles/stats/topparticipant');
			const topParticipants = response.data;
			console.log(topParticipants);
		}),

		addComment: withErrorHandler(async function (id: string, comment) {
			const response = await http.put(`/articles/comment/${id}`, comment);
			const oneItems = response.data;
			this.oneItems = oneItems;
			return true;
		}),
	},
});
