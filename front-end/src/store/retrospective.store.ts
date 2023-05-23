import { defineStore } from 'pinia';

// We do not want this store to be reset.
// defineStore<string, IInstaStore> : -> Very strict
export const useRetrospectiveStore = defineStore('retrospective', {
	state: () => ({
		titleNewRetro: '',
		optionTemplate: 0,
		privatePostit: [{
			user: "user",
			value: "Value"
		}]
	}),
	actions: {
		async createPrivatePostit(privatePostit) {
			this.privatePostit.push(privatePostit);
			// TODO: See if necessary to update DB
			return true;
		}
	},
});
