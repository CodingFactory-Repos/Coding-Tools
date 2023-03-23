import { defineStore } from 'pinia';

import { ProjectStorev2 } from '@/store/interfaces/projectv2.interface';

export const useProjectStorev2 = defineStore('projectv2', {
	state: (): ProjectStorev2 => {
		return {
			scene: undefined,
			canvas: undefined,
		};
	},
	actions: {
	},
});
