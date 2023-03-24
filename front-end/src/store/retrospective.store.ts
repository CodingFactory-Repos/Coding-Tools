import { tryCreateNewRetro, tryGetCurrentRetro } from '@/api/retrospective-req';
import { defineStore } from 'pinia';

// We do not want this store to be reset.
// defineStore<string, IInstaStore> : -> Very strict
export const useRetrospectiveStore = defineStore('retrospective', {
	state: () => ({
		retro: {
			title: '',
			optionTemplate: 0,
		}
	}),
	actions: {
		async createRetro(retro) {
			const isRetroCreated = (await tryCreateNewRetro(retro)).data;
			this.retro.title = isRetroCreated.newRetro.title;
			this.retro.optionTemplate = isRetroCreated.newRetro.optionTemplate;
			return isRetroCreated.newRetro.slug;
		},
		async getCurrentRetro(currentSlugRetro: string) {
			const { currentRetro } = (await tryGetCurrentRetro(currentSlugRetro)).data;
			this.retro.title = currentRetro.title;
			this.retro.optionTemplate = currentRetro.optionTemplate;
			console.log(this.retro.optionTemplate);
		}
	},
});
