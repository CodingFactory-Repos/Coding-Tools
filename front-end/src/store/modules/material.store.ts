import { defineStore } from 'pinia';

import { isEmpty } from '@/utils/string.helper';

import {
	getMaterials,
	createMaterial,
	updateMaterial,
	deleteMaterial,
	borrowMaterial,
	getPendingMaterials,
	acceptBorrowing,
} from '@/api/material-req';
import { withErrorHandler } from '@/utils/storeHandler';
import { Material, MaterialStore, BorrowingMaterial } from '@/store/interfaces/material.interface';

export const useMaterialStore = defineStore('materialStore', {
	state: (): {
		filter: { input: string; site: string; type: string; state: string };
		input: string;
		materials: Array<Material>;
		pendingMaterials: Array<Material>;
	} => {
		return {
			pendingMaterials: [],
			materials: [],
			filter: {
				input: '',
				site: '',
				state: '',
				type: '',
			},
			input: '',
		};
	},
	actions: {
		getMaterials: withErrorHandler(async function (this: MaterialStore) {
			const res = await getMaterials();
			if (res.status !== 200) throw new Error('The returned status was not expected');

			this.materials = res.data;
			return true;
		}),
		addMaterial: withErrorHandler(async function (
			this: MaterialStore,
			material: Partial<Material>,
		) {
			const res = await createMaterial(material);
			if (res.status !== 200) throw new Error('The returned status was not expected');
			this.materials.push(res.data);
			return true;
		}),
		updateMaterial: withErrorHandler(async function (
			this: MaterialStore,
			material: Material,
			id: string,
		) {
			const res = await updateMaterial(material, id);
			if (res.status !== 200) throw new Error('The returned status was not expected');
			const index = this.materials.findIndex((el) => el._id === id);
			this.materials[index] = res.data;
			return true;
		}),
		deleteMaterial: withErrorHandler(async function (id: string) {
			const res = await deleteMaterial(id);
			if (res.status !== 200) throw new Error('The returned status was not expected');
			const index = this.materials.findIndex((el) => el._id === id);
			this.materials.splice(index, 1);
			return true;
		}),
		borrowMaterial: withErrorHandler(async function (id: string, payload: BorrowingMaterial) {
			const res = await borrowMaterial(id, payload);
			if (res.status !== 200) throw new Error('The returned status was not expected');
			const index = this.materials.findIndex((el) => el._id === id);
			this.materials[index] = res.data;
			return true;
		}),
		getPendingMaterials: withErrorHandler(async function () {
			const res = await getPendingMaterials();
			if (res.status !== 200) throw new Error('The returned status was not expected');
			this.pendingMaterials = res.data;
			return true;
		}),
		acceptBorrowing: withErrorHandler(async function (id: string, payload: any) {
			const res = await acceptBorrowing(id, payload);
			if (res.status !== 200) throw new Error('The returned status was not expected');
			const index = this.pendingMaterials.findIndex((el) => el._id === id);
			this.pendingMaterials.splice(index, 1);
			return true;
		}),
	},
	getters: {
		filteredMaterial: (state) => {
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
				if (!isEmpty(state.filter.type)) {
					const res = material.type.toUpperCase().includes(state.filter.type.toUpperCase());
					validator.push(res);
				}
				return validator.every((el) => el === true);
			});
		},
	},
});
