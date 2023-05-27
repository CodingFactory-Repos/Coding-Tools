import { newPostit } from '@/api/retrospective-req';
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
			3: [],
			4: [],
		}
	}),
	actions: {
		async createPrivatePostit(privatePostit) {

			const resp = await newPostit(privatePostit);
			if (resp.status === 201) {
				this.privatePostit.push(resp.data.newPostit);
			}

			// TODO: See if necessary to update DB
			return true;
		},
		async addPostitToBoard(type: number, postit) {
			// TODO: Request To BDD
			// TODO: Implement socket io
			if (postit.type) {
				const lastIndex = this.currentRetro[postit.type].findIndex(el => el.id === postit.id);
				this.currentRetro[postit.type].splice(lastIndex, 1);
			} else {
				// This section is for the private space of the user where he creates his postits
				const privateIndex = this.privatePostit.findIndex(el => el.id === postit.id);
				this.privatePostit.splice(privateIndex, 1);
			}
			postit.type = type;
			this.currentRetro[type].push(postit);
			this.tempMovingPostit = {};
		},
		async setPostitToPriv(postit) {
			const isPostitExists = this.privatePostit.findIndex(el => el.id === postit.id);
			if (isPostitExists === -1) {
				if (postit.type) {
					const lastIndex = this.currentRetro[postit.type].findIndex(el => el.id === postit.id);
					this.currentRetro[postit.type].splice(lastIndex, 1);
				}
				delete postit.type;
				this.privatePostit.push(postit);
				this.tempMovingPostit = {};
			}
		},
		async updatePositionPostit(postit) {
			const indexBefore = this.
			console.log("here", postit);



		}
	},
});
