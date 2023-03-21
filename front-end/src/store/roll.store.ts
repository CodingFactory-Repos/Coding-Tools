import { defineStore } from 'pinia';

// We do not want this store to be reset.
// defineStore<string, IInstaStore> : -> Very strict
export const useRollStore = defineStore('roll', {
	state: () => ({
		studentList: []
	}),
	actions: {},
});
