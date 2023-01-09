import { defineStore } from 'pinia';

import { AgilityStore } from '@/store/interfaces/agility.interface';
import { apiTryGetTemplatesMeta, apiTryGetProjectsMeta } from '@/api/agility-req';

export const useAgilityStore = defineStore('agility', {
	state: (): AgilityStore => {
		return {
			metaProjects: [],
			metaTemplates: [],
			currentProject: {},
		};
	},
	actions: {
		async tryGetTemplatesMeta(this: AgilityStore) {
			try {
				const res = await apiTryGetTemplatesMeta().then((res) => res.data);
				if (res.status === 'ok') {
					this.metaTemplates = res.metaTemplates;
				}
			} catch {
				this.metaTemplates = [];
			}
		},
		async tryGetProjectsMeta(this: AgilityStore) {
			try {
				if (this.metaProjects.length > 0) return;
				const res = await apiTryGetProjectsMeta().then((res) => res.data);
				if (res.status === 'ok') {
					this.metaProjects = res.metaProjects;
				}
			} catch {
				this.metaProjects = [];
			}
		},
	},
});
