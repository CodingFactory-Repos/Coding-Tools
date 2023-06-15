<template>
	<div class="backdrop" @click="$emit('close')" />
	<div
		class="popUpItem flex p-6 rounded-lg absolute left-0 right-0 top-0 bottom-0 m-auto w-2/3 h-[70%] justify-center flex-col items-center min-w-[370px] max-w-[520px] bg-light-tertiary dark:bg-dark-tertiary"
	>
		<button
			class="top-5 right-5 absolute text-dark-icon dark:text-dark-font"
			@click="$emit('close')"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				fill="currentColor"
				viewBox="0 0 16 16"
			>
				<path
					d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
				/>
			</svg>
		</button>
		<form
			class="m-25 text-left py-5 px-10 rounded-lg w-auto text-center flex flex-col"
			@submit.prevent="postBdd"
		>
			<span class="p-4 text-dark-secondary dark:text-dark-font text-3xl"
				>Ajouter une proposition
			</span>
			<span class="p-4 text-2xl text-dark-secondary dark:text-dark-font">{{ title }}</span>
			<div class="flex flex-col w-full self-center mt-2.5 mb-3">
				<div class="p-2.5 relative w-full">
					<input
						id="price"
						class="invalid:border-red-500 invalid:text-red-500 w-full bg-light-secondary text-dark-secondary border sm:text-sm rounded-lg p-2.5 placeholder-gray-400"
						placeholder="Prix"
						v-model="price"
						pattern="[0-9]+"
					/>
					<div class="absolute top-1/3 right-5 text-dark-secondary">€</div>
				</div>
				<textarea
					id="desc"
					class="m-2.5 bg-light-secondary text-dark-secondary border sm:text-sm rounded-lg p-2.5 placeholder-gray-400"
					placeholder="Description"
					col="20"
					v-model="desc"
				/>
				<input
					id="link"
					class="m-2.5 bg-light-secondary text-dark-secondary border sm:text-sm rounded-lg p-2.5 placeholder-gray-400"
					placeholder="Lien"
					v-model="link"
				/>
				<textarea
					id="motiv"
					class="m-2.5 bg-light-secondary text-dark-secondary border sm:text-sm rounded-lg p-2.5 placeholder-gray-400"
					placeholder="Pour quel usage ?"
					v-model="motiv"
				/>
				<button
					class="w-fit self-center mt-2.5 w-fit font-bold rounded-lg text-white text-sm px-4 py-2 focus:outline-none gap-2 gradiant"
					@click="$emit('validation')"
				>
					Valider
				</button>
			</div>
		</form>
	</div>
</template>
<script>
import { http } from '@/api/network/axios';
import { useUserStore } from '@/store/modules/user.store';
import { computed, watch } from 'vue';

import { useAuthStore } from '@/store/modules/auth.store';

const authStore = useAuthStore();
const userStore = useUserStore();

const user = computed(() => authStore.user);
const userId = computed(() => user.value._id);

console.log(userId);

export default {
	props: ['title'],
	data() {
		return {
			userId,
		};
	},
	methods: {
		async postBdd() {
			await http.post('/ideasequipments/add', {
				title: this.title,
				price: this.price,
				desc: this.desc,
				link: this.link,
				motiv: this.motiv,
				user: this.userId,
			});
			this.$emit('close');
			this.$emit('validation');
		},
	},
};
</script>
