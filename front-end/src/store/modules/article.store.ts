import { Article, ArticleStore, Participants } from '../interfaces/article.interface';
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
						descriptions: '',
						picture: '',
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

		//update article in the database
		updateArticle: withErrorHandler(async function (id: string, article: Article) {
			const response = await http.put(`/articles/update/${id}`, article);
			const oneItems = response.data;
			this.oneItems = oneItems;
			return true;
		}),

		// add participant to the array of participants in article in the database
		addParticipant: withErrorHandler(async function (id: string, participant) {
			await http.put(`/articles/participant/${id}`, participant);

			this.oneItems.participants.push(participant);

			return true;
		}),

		// remove participant from the array of participants in article in the database
		removeParticipant: withErrorHandler(async function (id: string, participant: Participants) {
			await http.put(`/articles/removeParticipant/${id}`, participant);

			const index = this.oneItems.participants.findIndex((el) => el.id === participant.id);
			this.oneItems.participants.splice(index, 1);

			return true;
		}),

		// add like to the array of likes in article in the database
		addLike: withErrorHandler(async function (id: string, like) {
			const response = await http.put(`/articles/like/${id}`, like);
			const items = response.data;

			const index = this.items.findIndex((el) => el._id === id);
			this.items[index] = items;

			return true;
		}),

		// remove like from the array of likes in article in the database
		removeLike: withErrorHandler(async function (id: string, like) {
			const response = await http.put(`/articles/removeLike/${id}`, like);
			const items = response.data;

			const index = this.items.findIndex((el) => el._id === id);
			this.items[index] = items;

			return true;
		}),

		// add Dislike to the array of Dislikes in article in the database
		addDislike: withErrorHandler(async function (id: string, dislike) {
			const response = await http.put(`/articles/dislike/${id}`, dislike);
			const items = response.data;

			const index = this.items.findIndex((el) => el._id === id);
			this.items[index] = items;

			return true;
		}),

		// remove Dislike from the array of Dislikes in article in the database
		removeDislike: withErrorHandler(async function (id: string, dislike) {
			const response = await http.put(`/articles/removeDislike/${id}`, dislike);
			const items = response.data;

			const index = this.items.findIndex((el) => el._id === id);
			this.one[index] = items;

			return true;
		}),

		addComment: withErrorHandler(async function (id: string, comment) {
			await http.put(`/articles/comment/${id}`, comment);
			this.oneItems.comments.push(comment);
			return true;
		}),

		deleteArticle: withErrorHandler(async function (id: string) {
			const response = await http.delete(`/articles/delete/${id}`);
			const oneItems = response.data;
			this.oneItems = oneItems;
			return true;
		}),
	},
});
