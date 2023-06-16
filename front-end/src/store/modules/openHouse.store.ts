import { OpenHouseStore } from '../interfaces/openhouse.store';
import { defineStore } from 'pinia';
import { http } from '@/api/network/axios';
import { withErrorHandler } from '@/utils/storeHandler';

export const useOpenHouseStore = defineStore('openhouse', {
	state: (): OpenHouseStore => {
		return {
			items: [
				{
					_id: '',
					title: '',
					picture: '',
					date: '',
					schedule: [
						{
							time: '',
							activity: '',
						},
					],
					address: [
						{
							street: '',
							zipCode: '',
							city: '',
						},
					],
					group: '',
					participants: [
						{
							name: '',
						},
					],
					description: '',
					project: '',
					files: '',
				},
			],
			oneItems: {
				_id: '',
				title: '',
				date: '',
				picture: '',
				schedule: [
					{
						time: '',
						activity: '',
					},
				],
				address: [
					{
						street: '',
						zipCode: '',
						city: '',
					},
				],
				group: '',
				participants: [
					{
						name: '',
					},
				],
				description: '',
				project: '',
				files: '',
			},
			idOpenHouse: '',
		};
	},
	actions: {
		//get openHouse in the database
		getOpenHouse: withErrorHandler(async function () {
			const response = await http.get('/openhouses');
			const items = response.data;
			this.items = items;
			return true;
		}),
		//get openHouse by id
		getOpenHouseById: withErrorHandler(async function (id: string) {
			const response = await http.get(`/openhouses/${id}`);
			const oneItems = response.data;
			this.oneItems = oneItems;
			return true;
		}),
	},
});
