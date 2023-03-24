import { defineStore } from 'pinia';

import { isEmpty } from '@/utils/string.helper';

export const useMaterialStore = defineStore('materialStore', {
	state: (): {
		filter: { input: string; site: string; category: string; state: string };
		input: string;
		materials: any[];
	} => {
		return {
			materials: [],
			filter: {
				input: '',
				site: '',
				state: '',
				category: '',
			},
			input: '',
		};
	},
	getters: {
		filteredMaterial: (state) => {
			// if (isEmpty(state.input)) return state.materials;
			return state.materials.filter((material) => {
				const validator: Array<boolean> = [];

				if (!isEmpty(state.input)) {
					const res = material.name.toUpperCase().includes(state.input.toUpperCase());
					validator.push(res);
				}
				// Si on a un site, on check si le matériel vient de ce site et on push dans validator;
				if (!isEmpty(state.filter.site)) {
					const res = material.siteLocation.toUpperCase().includes(state.filter.site.toUpperCase());
					validator.push(res);
				}
				// Si on a un état, on check si le matériel possède cet état et on push dans validator;
				if (!isEmpty(state.filter.state)) {
					const res = material.state.toUpperCase().includes(state.filter.state.toUpperCase());
					validator.push(res);
				}
				// Si on a une catégorie, on check si le matériel possède cette catégorie.
				if (!isEmpty(state.filter.category)) {
					const res = material.state.toUpperCase().includes(state.filter.category.toUpperCase());
					validator.push(res);
				}
				return validator.every((el) => el === true);
			});
		},
	},
});
