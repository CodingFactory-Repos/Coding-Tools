import { defineStore } from 'pinia';

import { AgilityStore } from '@/store/interfaces/agility.interface';
import { apiTryGetTemplatesMeta, apiTryGetProjectsMeta, apiTryCreateNewProject, apiTryGetRoomProject } from '@/api/agility-req';
import { withErrorHandler } from '@/utils/storeHandler';

export const useAgilityStore = defineStore('agility', {
	state: (): AgilityStore => {
		return {
			projects: [],
			metaTemplates: [],
			currentProject: [],
		};
	},
	actions: {
		tryCreateNewProject: withErrorHandler(async function(this: AgilityStore) {
			const res = await apiTryCreateNewProject();
			if(res.data.status === 'ok') {
				return res.data.roomId
			}
			return false;
		}),
		tryGetProjectsMeta: withErrorHandler(async function(this: AgilityStore) {
			const res = await apiTryGetProjectsMeta();
			if(res.data.status === 'ok') {
				this.projects = res.data.projects;
				return true;
			}
			return false;
		}),
		tryGetRoomProject: withErrorHandler(async function(this: AgilityStore, roomId: string) {
			const res = await apiTryGetRoomProject(roomId);
			if(res.data.status === 'ok') {
				this.currentProject = res.data.project;
				return true;
			}
			return false;
		}),

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
	},
});
