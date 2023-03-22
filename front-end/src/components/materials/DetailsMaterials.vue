<template>
	<div v-if="userRole === 1">
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
	<div v-if="userRole === 2 || userRole === 3">
		<div class="mb-5"></div>
		<form @submit.prevent="editMaterial">
			<div class="form-group relative z-0 w-full mb-6">
				<label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>Name</label
				>
				<input
					type="text"
					id="name"
					v-model="material.name"
					name="name"
					class="dark:text-white form-control block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none"
					placeholder="Enter name"
					required
				/>
			</div>

			<div class="form-group">
				<label for="Type" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>Type</label
				>
				<select
					id="type"
					v-model="material.type"
					class="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
					required
				>
					<option value="" disabled selected>Select the Type</option>
					<option value="Hardware">Hardware</option>
					<option value="Mac">Mac</option>
					<option value="Livre">Livres</option>
				</select>
			</div>

			<div class="form-group">
				<label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>Price</label
				>
				<input
					type="number"
					class="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
					id="price"
					v-model="material.price"
					placeholder="Enter price"
					required
				/>
			</div>

			<div class="form-group">
				<label for="picture" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>Picture</label
				>
				<input
					type="url"
					class="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
					id="picture"
					v-model="material.picture"
					placeholder="Enter picture"
					required
				/>
			</div>

			<div class="form-group">
				<label for="state" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>State</label
				>
				<select
					v-model="material.state"
					class="form-control form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
					required
				>
					<option value="" disabled selected>Select the State</option>
					<option value="Excellent">Etat Excellent</option>
					<option value="Bon">Bon Etat</option>
					<option value="Mauvais">Mauvais Etat</option>
				</select>
			</div>

			<div class="form-group">
				<label for="site" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>Site</label
				>
				<select
					v-model="material.siteLocation"
					class="form-control form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
					required
				>
					<option value="" disabled selected>Select the Site</option>
					<option value="Cergy">Cergy</option>
					<option value="Paris">Paris</option>
				</select>
			</div>

			<div class="form-group">
				<label
					for="storageCupboard"
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>Storage Cupboard</label
				>
				<select
					v-model="material.storageCupboard"
					class="form-control form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
					required
				>
					<option value="" disabled selected>Select the Storage</option>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
				</select>
			</div>

			<div class="form-group">
				<label
					for="description"
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>Description</label
				>
				<input
					type="text"
					class="dark:text-white form-control block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none"
					id="description"
					v-model="material.description"
					placeholder="Enter description"
					required
				/>
			</div>
			<!-- Add a litte space between the 2 -->
			<div class="mb-5"></div>
			<div class="flex items-center justify-between">
				<Button
					href="#"
					class="text-white font-bold rounded-lg text-l px-4 py-2 focus:outline-none flex justify-center items-center gap-2 gradiant"
					>Edit</Button
				>
				<Button
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

export default {
	props: {
		id: String,
		userId: String,
	},
	setup(props) {
		const data = toRefs(
			defineProps({
				id: String,
				userId: String,
			}),
		);

		let material = ref({});
		let userRole = ref({});
		// console.log(props.userId);

		const getUserRole = () => {
			http
				.get(`materials/user/role/` + props.userId)
				.then((res) => {
					userRole.value = res.data;
				})
				.catch((err) => {
					console.log(err);
				});
		};

		const getMaterialInfo = (id) => {
			http
				.get(`materials/test/` + id)
				.then((res) => {
					// Convert the date to string
					res.data.acquisitionDate = new Date(res.data.acquisitionDate).toLocaleDateString();
					//delete the _id
					delete res.data._id;
					material.value = res.data;
					// console.log(material.value);
				})
				.catch((err) => {
					console.log(err);
				});
		};

		const editMaterial = () => {
			// console.log(typeof material.value._id);
			http
				.put(`materials/update/` + props.id, {
					...material.value,
				})
				.then((res) => {
					//Reload the page
					window.location.reload();
				})
				.catch((err) => {
					console.log(err);
				});
		};

		const deleteMaterial = () => {
			http
				.delete(`materials/delete/` + props.id)
				.then((res) => {
					//Reload the page
					window.location.reload();
				})
				.catch((err) => {
					console.log(err);
				});
		};

		onMounted(() => {
			getUserRole();
			getMaterialInfo(props.id);
		});

		return {
			...props,
			...data,
			material,
			userRole,
			editMaterial,
			deleteMaterial,
		};
	},
};
</script>

<style scoped></style>
