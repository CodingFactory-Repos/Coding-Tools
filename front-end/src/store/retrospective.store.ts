import { defineStore } from 'pinia';

// We do not want this store to be reset.
// defineStore<string, IInstaStore> : -> Very strict
export const useRetrospectiveStore = defineStore('retrospective', {
	state: () => ({
		titleNewRetro: '',
		optionTemplate: 0,
		privatePostit: [],
		tempMovingPostit: {},
		currentRetro: {
			1: [],
			2: [],
			3: []
		}
	}),
	actions: {
		async createPrivatePostit(privatePostit) {
			this.privatePostit.push(privatePostit);
			// TODO: See if necessary to update DB
			return true;
		},
		async addPostitToBoard(type: number, postit) {
			// TODO: Request To BDD
			// TODO: Implement socket io
			this.currentRetro[type].push(postit);
			this.tempMovingPostit = {};
			this.privatePostit.splice(postit.index, 1);
		},
		async updatePositionPostit(postit) {


		}
	},
});
