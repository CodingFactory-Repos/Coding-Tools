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
					owner: '',
					date: '',
					title: '',
					descriptions: '',
					picture: '',
					tags: '',
					type: '',
					status: '',
				},
			],
			oneItems: {
				_id: '',
				owner: '',
				title: '',
				date: '',
				descriptions: '',
				picture: '',
				tags: '',
				type: '',
				status: '',
				content: '',
				participants: [
					{
						id: '',
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
			console.log('id', id);
			console.log('participant', participant);
			// const response = await http.put(`/articles/participant/${id}`, participant);
			// const oneItems = response.data;
			// this.oneItems = oneItems;
			// return true;
		}),

		// remove participant from the array of participants in article in the database
		removeParticipant: withErrorHandler(async function (id: string, participant) {
			const response = await http.put(`/articles/removeParticipant/${id}`, participant);
			const oneItems = response.data;
			this.oneItems = oneItems;
			return true;
		}),

		// add like to the array of likes in article in the database
		addLike: withErrorHandler(async function (id: string, like) {
			const response = await http.put(`/articles/like/${id}`, like);
			const oneItems = response.data;
			this.oneItems = oneItems;
			return true;
		}),

		// remove like from the array of likes in article in the database
		removeLike: withErrorHandler(async function (id: string, like) {
			const response = await http.put(`/articles/removeLike/${id}`, like);
			const oneItems = response.data;
			this.oneItems = oneItems;
			return true;
		}),

		// add Dislike to the array of Dislikes in article in the database
		addDislike: withErrorHandler(async function (id: string, dislike) {
			const response = await http.put(`/articles/dislike/${id}`, dislike);
			const oneItems = response.data;
			this.oneItems = oneItems;
			return true;
		}),

		// remove Dislike from the array of Dislikes in article in the database
		removeDislike: withErrorHandler(async function (id: string, dislike) {
			const response = await http.put(`/articles/removeDislike/${id}`, dislike);
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
