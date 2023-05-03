<template>
	<div v-if="userInfo.role === 1">
		<a href="#">
			<img
				v-if="material.picture"
				class="w-full h-96 rounded-lg shadow-md"
				:src="material.picture"
				alt="product image"
			/>
		</a>
		<div class="px-5 pb-5 text-center flex flex-col">
			<a href="#">
				<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
					{{ material.name }}
				</h5>
			</a>
			<div class="flex items-center mt-2.5">
				<span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{
					material.acquisitionDate
				}}</span>
				<span class="mx-2 text-gray-400 dark:text-gray-300">•</span>
				<span class="text-sm font-medium text-gray-500 dark:text-gray-400"
					>Etats : {{ material.state }}</span
				>
			</div>
			<div class="flex items-center mt-2.5">
				<span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{
					material.siteLocation
				}}</span>
				<span class="mx-2 text-gray-400 dark:text-gray-300">•</span>
				<span class="text-sm font-medium text-gray-500 dark:text-gray-400"
					>Armoire : {{ material.storageCupboard }}</span
				>
			</div>
			<span class="text-2xl font-bold text-gray-900 dark:text-white">{{ material.price }} €</span>
		</div>
	</div>
	<div v-if="userInfo.role === 2 || userInfo.role === 3">
		<div class="mb-5"></div>
		<form @submit.prevent="editMaterial">
			<!-- Show the image and make it fit the screen -->
			<div class="flex flex-col items-center justify-center w-full h-full">
				<img
					@click="showLink = !showLink"
					v-if="material.picture"
					class="w-24 h-24 rounded-lg shadow-md"
					:src="material.picture"
					alt="product image"
				/>
			</div>
			<div v-if="showLink === true">
				<label class="text-white dark:text-gray-200" for="username">Image Link</label>
				<input
					id="name"
					v-model="material.picture"
					type="text"
					class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				/>
			</div>
			<div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
				<div>
					<label class="text-white dark:text-gray-200" for="username">Name</label>
					<input
						id="name"
						v-model="material.name"
						type="text"
						class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
					/>
				</div>

				<div>
					<label class="text-white dark:text-gray-200" for="passwordConfirmation">Type</label>
					<select
						v-model="material.type"
						class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
					>
						<option value="Hardware">Hardware</option>
						<option value="Mac">Mac</option>
						<option value="Livre">Livres</option>
					</select>
				</div>

				<div>
					<label class="text-white dark:text-gray-200" for="password">Price</label>
					<input
						id="password"
						type="number"
						v-model="material.price"
						class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
					/>
				</div>

				<div>
					<label class="text-white dark:text-gray-200" for="passwordConfirmation">Type</label>
					<select
						v-model="material.state"
						class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
					>
						<option value="Excellent">Etat Excellent</option>
						<option value="Bon">Bon Etat</option>
						<option value="Mauvais">Mauvais Etat</option>
					</select>
				</div>
				<div>
					<label class="text-white dark:text-gray-200" for="passwordConfirmation">Site</label>
					<select
						v-model="material.siteLocation"
						class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
					>
						<option value="Cergy">Cergy</option>
						<option value="Paris">Paris</option>
					</select>
				</div>
				<div>
					<label class="text-white dark:text-gray-200" for="passwordConfirmation"
						>Storage Cupboard</label
					>
					<select
						v-model="material.storageCupboard"
						class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
					>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
					</select>
				</div>
			</div>
			<div class="mb-5"></div>
			<div>
				<label class="text-white dark:text-gray-200" for="passwordConfirmation">Description</label>
				<textarea
					id="textarea"
					type="textarea"
					v-model="material.description"
					class="max-h-48 block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				></textarea>
			</div>
			<div class="mb-5"></div>
			<!-- Create a div that show all the borrowingHistory -->
			<div v-if="showHistory">
				<BorrowHistoryMaterials :history="material.borrowingHistory" :userInfo="userInfo" />
			</div>
			<div class="mb-5"></div>
			<div class="flex items-center justify-between">
				<Button
					type="button"
					@click="showHistory = !showHistory"
					class="text-white font-bold rounded-lg text-l px-4 py-2 focus:outline-none flex justify-center items-center gap-2 gradiant"
					>History</Button
				>
				<Button
					type="submit"
					class="text-white font-bold rounded-lg text-l px-4 py-2 focus:outline-none flex justify-center items-center gap-2 gradiant"
					>Edit</Button
				>
				<Button
					type="button"
					@click="deleteMaterial"
					class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
					>Delete</Button
				>
			</div>
		</form>
	</div>
</template>

<script lang="ts">
import { defineProps, onMounted, ref, toRefs } from 'vue';
import { http } from '@/api/network/axios';
import BorrowHistoryMaterials from '@/components/materials/BorrowHistoryMaterials.vue';
import { useMaterialStore } from '@/store/modules/material.store';
import { Material } from '@/store/interfaces/material.interface';

const materialStore = useMaterialStore();

export default {
	components: {
		BorrowHistoryMaterials,
	},
	props: {
		id: String,
		userId: String,
	},
	setup(props) {
		//! TODO: Vous avez déjà props.id et props.userId
		//! Les props peuvent directement être utilisé dans le template
		//! Pas besoin de return data
		const data = toRefs(
			defineProps({
				id: String,
				userId: String,
			}),
		);

		let material = ref<Material>();
		let userInfo = ref({})
		let showLink = ref({});
		let showHistory = ref(false);

		const getUserInfo = () => {
			//! TODO: Remove it, get the id from the auth/me instead
			http.get(`materials/user/` + props.userId).then((res) => {
				userInfo.value = res.data;
			});
		};

		const getMaterialInfo = (id: string) => {
			http
				.get(`materials/get/` + id)
				.then((res) => {
					// Convert the date to string
					res.data.acquisitionDate = new Date(res.data.acquisitionDate).toLocaleDateString();
					// delete the _id
					//! Vous pouvez prevent l'envoie de l'id directement depuis le backend dans les options d'une query
					delete res.data._id;
					material.value = res.data;
				})
				.catch((err) => {
					console.log(err);
				});
		};

		const editMaterial = () => {
			materialStore.updateMaterial(material.value, props.id);
		};

		const deleteMaterial = () => {
			materialStore.deleteMaterial(props.id);
		};
		onMounted(async () => {
			getUserInfo();
			getMaterialInfo(props.id);
		});
		return {
			...data,
			material,
			showLink,
			showHistory,
			editMaterial,
			deleteMaterial,
			userInfo,
		};
	},
};
</script>
