import {
	Article,
	ArticleStore,
	Comments,
	Dislikes,
	Likes,
	Participants,
} from '../interfaces/article.interface';
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
					date: new Date(),
					title: '',
					descriptions: '',
					content: '',
					picture: '',
					tags: '',
					type: '',
					status: '',
					likes: [],
					dislikes: [],
				},
			],
			oneItems: {
				_id: '',
				owner: '',
				title: '',
				date: new Date(),
				descriptions: '',
				picture: '',
				tags: '',
				type: '',
				status: '',
				content: '',
				participants: [
					{
						_id: '',
						firstName: '',
						lastName: '',
						email: '',
					},
				],
				comments: [
					{
						_id: '',
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
			await http.post('/articles/add', article);

			this.items.push(article);

			return true;
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

			const index = this.oneItems.participants.findIndex((el) => el._id === participant._id);
			console.log('index', index);
			this.oneItems.participants.splice(index, 1);

			return true;
		}),

		// add like to the array of likes in article in the database
		addLike: withErrorHandler(async function (id: string, like: Likes) {
			await http.put(`/articles/like/${id}`, like);

			const index = this.items.findIndex((el) => el._id === id);
			this.items[index].likes.push(like);

			return true;
		}),

		// remove like to the array of likes in article in the database
		removeLike: withErrorHandler(async function (id: string, like: Likes) {
			await http.put(`/articles/removeLike/${id}`, like);

			const index = this.items.findIndex((el) => el._id === id);
			const indexLike = this.items[index].likes.findIndex((el) => el.id === like);
			this.items[index].likes.splice(indexLike, 1);

			return true;
		}),

		// add dislike to the array of dislike in article in the database
		addDislike: withErrorHandler(async function (id: string, dislike: Dislikes) {
			await http.put(`/articles/dislike/${id}`, dislike);

			const index = this.items.findIndex((el) => el._id === id);
			this.items[index].dislikes.push(dislike);

			return true;
		}),

		// remove dislike to the array of dislike in article in the database
		removeDislike: withErrorHandler(async function (id: string, dislike: Dislikes) {
			await http.put(`/articles/removeDislike/${id}`, dislike);

			const index = this.items.findIndex((el) => el._id === id);
			const indexDislike = this.items[index].dislikes.findIndex((el) => el.id === dislike);
			this.items[index].dislikes.splice(indexDislike, 1);

			return true;
		}),

		getParticipants: withErrorHandler(async function (id: string) {
			const response = await http.get(`/articles/participant/${id}`);
			const participants = response.data.map((participant) => participant._id);
			return participants;
		}),

		getArticleWithMostParticipants: withErrorHandler(async function () {
			const response = await http.get('articles/stats/participant');
			const participants = response.data.map((participant) => ({
				_id: participant._id,
				title: participant.title,
				nombreparticipant: participant.numParticipants,
			}));
			return participants;
		}),

		getTopCreateur: withErrorHandler(async function () {
			const response = await http.get('/articles/stats/topcreateur');
			const createur = response.data.map((createur) => ({
				_id: createur._id,
				firstName: createur.firstName,
				lastName: createur.lastName,
				count: createur.count,
			}));
			return createur;
		}),

		getTopParticipant: withErrorHandler(async function () {
			const response = await http.get('articles/stats/topparticipant');
			const topParticipants = response.data;
			console.log(topParticipants);
		}),

		addComment: withErrorHandler(async function (id: string, comment) {
			await http.put(`/articles/comment/${id}`, comment);
			this.oneItems.comments.push(comment);
			return true;
		}),

		// remove comment from the array of comments in article in the database
		removeComment: withErrorHandler(async function (id: string, comment: Comments) {
			await http.put(`/articles/removeComment/${id}`, comment);

			const index = this.oneItems.comments.findIndex((el) => el._id === comment._id);
			this.oneItems.comments.splice(index, 1);

			return true;
		}),

		// delete article from the database
		deleteArticle: withErrorHandler(async function (id: string) {
			await http.delete(`/articles/delete/${id}`);

			const index = this.items.findIndex((el) => el._id === id);
			this.items.splice(index, 1);

			return true;
		}),
	},
});
