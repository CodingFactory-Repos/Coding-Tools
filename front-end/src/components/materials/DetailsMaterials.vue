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
		<form>
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
				<div>
					<label class="text-white dark:text-gray-200" for="passwordConfirmation"
						>Description</label
					>
					<textarea
						id="textarea"
						type="textarea"
						v-model="material.description"
						class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
					></textarea>
				</div>
				<div>
					<label class="block text-sm font-medium text-white"> Image </label>
					<div
						class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
					>
						<div class="space-y-1 text-center">
							<svg
								class="mx-auto h-12 w-12 text-white"
								stroke="currentColor"
								fill="none"
								viewBox="0 0 48 48"
								aria-hidden="true"
							>
								<path
									d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							<div class="flex text-sm text-gray-600">
								<label
									for="file-upload"
									class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
								>
									<span class="">Upload a file</span>
									<input id="file-upload" name="file-upload" type="file" class="sr-only" />
								</label>
								<p class="pl-1 text-white">or drag and drop</p>
							</div>
							<p class="text-xs text-white">PNG, JPG, GIF up to 10MB</p>
						</div>
					</div>
				</div>
			</div>
			<div class="mb-5"></div>
			<div class="flex items-center justify-between">
				<Button
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
				.put(`materials/update/${props.id}`, {
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
