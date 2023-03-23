import { defineStore } from 'pinia';

import { MaterialStore } from '@/store/interfaces/material.interface';
import { isEmpty } from '@/utils/string.helper';

export const useMaterialStore = defineStore('materialStore', {
	state: (): MaterialStore => {
		return {
			materials: [],
			input: '',
		};
	},
	getters: {
		filteredMaterial: (state) => {
			if (isEmpty(state.input)) return state.materials;
			return state.materials.filter((material) =>
				material.name.toUpperCase().includes(state.input.toUpperCase()),
			);
		},
	},
});
