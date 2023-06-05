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
	getUserById,
	declineBorrowing,
	returnMaterial,
} from '@/api/material-req';
import { withErrorHandler } from '@/utils/storeHandler';
import { Material, MaterialStore, BorrowingMaterial } from '@/store/interfaces/material.interface';

export const useMaterialStore = defineStore('materialStore', {
	state: (): {
		filter: { input: string; site: string; type: string; state: string; status: boolean };
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
				status: true,
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
			if (res.status !== 200) return false;
			this.materials.push(res.data);
			return true;
		}),
		updateMaterial: withErrorHandler(async function (
			this: MaterialStore,
			material: Material,
			id: string,
		) {
			const res = await updateMaterial(material, id);
			if (res.status !== 200) return false;
			const index = this.materials.findIndex((el) => el._id === id);
			this.materials[index] = res.data;
			return true;
		}),
		deleteMaterial: withErrorHandler(async function (id: string) {
			const res = await deleteMaterial(id);
			if (res.status !== 200) return false;
			const index = this.materials.findIndex((el) => el._id === id);
			this.materials.splice(index, 1);
			return true;
		}),
		borrowMaterial: withErrorHandler(async function (id: string, payload: BorrowingMaterial) {
			const res = await borrowMaterial(id, payload);
			if (res.status !== 200) return false;
			const index = this.materials.findIndex((el) => el._id === id);
			this.materials[index] = res.data;
			return true;
		}),
		getPendingMaterials: withErrorHandler(async function () {
			const res = await getPendingMaterials();
			if (res.status !== 200) return false;
			this.pendingMaterials = res.data;
			return true;
		}),
		acceptBorrowing: withErrorHandler(async function (id: string, payload: BorrowingMaterial) {
			const res = await acceptBorrowing(id, payload);
			if (res.status !== 200) return false;
			const index = this.pendingMaterials.findIndex((el) => el._id === id);
			this.pendingMaterials.splice(index, 1);
			const index2 = this.materials.findIndex((el) => el._id === id);
			this.materials[index2] = res.data;
			return true;
		}),
		declineBorrowing: withErrorHandler(async function (id: string, payload: BorrowingMaterial) {
			const res = await declineBorrowing(id, payload);
			if (res.status !== 200) return false;
			const index = this.pendingMaterials.findIndex((el) => el._id === id);
			this.pendingMaterials.splice(index, 1);
			return true;
		}),
		returnMaterial: withErrorHandler(async function (id: string, payload: BorrowingMaterial) {
			const res = await returnMaterial(id, payload);
			if (res.status !== 200) return false;
			const index = this.materials.findIndex((el) => el._id === id);
			this.materials[index] = res.data;
			return true;
		}),
		getUserById: withErrorHandler(async function (id: string) {
			const res = await getUserById(id);
			if (res.status !== 200) return false;
			return res.data;
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
				//On check si le matériel est disponible ou indisponible et on push dans le validator;
				if (state.filter.status !== null) {
					const res = material.status === state.filter.status;
					validator.push(res);
				}
				return validator.every((el) => el === true);
			});
		},
	},
});
