import { createRetro, newPostit, tryGetCurrentRetro } from '@/api/retrospective-req';
import { defineStore } from 'pinia';
import { Postit, Retrospective, RetrospectiveStore } from './interfaces/retrospective.interface';


const retrospectiveDefaultState = (): RetrospectiveStore => ({
	privatePostit: [],
	tempMovingPostit: {},
	currentRetro: {}
});
// We do not want this store to be reset.
// defineStore<string, RetroStore> : -> Very strict
export const useRetrospectiveStore = defineStore('retrospective', {
	state: (): RetrospectiveStore => retrospectiveDefaultState (),
	actions: {
		async createNewRetro(this: RetrospectiveStore, retro: Retrospective) {
			const resp = await createRetro(retro);
			if (resp.status === 201)
				return resp.data
		},
		async getCurrentRetro(slug: string) {
			const resp = await tryGetCurrentRetro(slug);
			if (resp.status === 201)
				this.currentRetro = resp.data.currentRetro
		},
		async createPrivatePostit(this:  RetrospectiveStore, privatePostit: Postit) {
			const resp = await newPostit(privatePostit);
			if (resp.status === 201) {
				this.privatePostit.push(resp.data.newPostit);
			}

			// TODO: See if necessary to update DB
			return true;
		},
		async addPostitToBoard(this: RetrospectiveStore, type: number, postit: Postit) {
			// TODO: Request To BDD
			// TODO: Implement socket io
			if (postit.type) {
				const lastIndex = this.currentRetro.postits[postit.type].findIndex((el: Postit) => el.id === postit.id);
				this.currentRetro.postits[postit.type].splice(lastIndex, 1);
			} else {
				// This section is for the private space of the user where he creates his postits
				const privateIndex = this.privatePostit.findIndex(el => el.id === postit.id);
				this.privatePostit.splice(privateIndex, 1);
			}
			postit.type = type;
			this.currentRetro.postits[type].push(postit);
			this.tempMovingPostit = {};
		},
		async setPostitToPriv(this: RetrospectiveStore, postit: Postit) {
			const isPostitExists = this.privatePostit.findIndex(el => el.id === postit.id);
			if (isPostitExists === -1) {
				if (postit.type) {
					const lastIndex = this.currentRetro.postits[postit.type].findIndex((el: Postit) => el.id === postit.id);
					this.currentRetro.postits[postit.type].splice(lastIndex, 1);
				}
				delete postit.type;
				this.privatePostit.push(postit);
				this.tempMovingPostit = {};
			}
		},
		async updatePositionPostit(this: RetrospectiveStore, postit: Postit) {
			// const indexBefore = this.
			console.log("here", postit);



		}
	},
});
