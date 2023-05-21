<template>
	<div class="ideas-comments mt-4">
		<span class="text-xs !text-opacity-50 text-dark-primary dark-primary dark:text-dark-font"
			>Commentaires :
		</span>
		<form action="" class="flex flex-col" @submit.prevent="postBdd">
			<ul class="ideas-comments__messages border-2 border-dark-font rounded-lg mb-4 mt-2">
				<li class="px-4" v-for="item in items">
					<span class="text-xs !text-opacity-50 text-dark-primary dark-primary dark:text-dark-font">
						{{ item.user[0].profile.firstName }} {{ item.user[0].profile.lastName }} -
						{{ formatDate(item.date) }}
					</span>
					<br />
					<span class="text-dark-primary dark:text-dark-font">{{ item.comment }}</span>
				</li>
			</ul>
			<div class="flex">
				<input
					class="bg-light-secondary border text-dark-primary sm:text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 mr-4"
					type="text"
					placeholder="Ajouter un commentaire"
					v-model="comment"
				/>
				<button
					class="font-bold bg-light-icon rounded-lg text-sm focus:outline-none dark:text-dark-font dark:disabled:bg-dark-tertiary dark:disabled:text-dark-icon dark:bg-dark-tertiary disabled:bg-light-tertiary disabled:text-light-font border-2 border-dark-font disabled:border-dark-icon items-center gap-2"
					:disabled="comment === ''"
				>
					Envoyer
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

export default {
	props: ['equipmentId'],
	data() {
		return {
			items: [],
			comment: '', //item before adding into array
			userId,
		};
	},
	computed: {},

	watch: {
		equipmentId: function () {
			this.getComments();
		},
	},

	methods: {
		async postBdd() {
			const { comment, equipmentId, userId } = this;
			const { data: items } = await http.post('/ideascomments/add', {
				userId,
				comment,
				equipmentId,
			});
			this.items = items || [];
			this.comment = '';
		},
		async getComments() {
			console.log('getComments()');
			const { comment, equipmentId, userId } = this;
			const body = { comment, equipmentId, userId };
			const { data: items } = await http.get(`/ideascomments/equipment/${equipmentId}`, body);
			console.log('oui');
			console.log({ data: items });
			this.items = items || [];
		},
		formatDate(date) {
			const options = {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
			};
			return new Date(date).toLocaleString('fr-FR', options);
		},
	},
	async created() {
		this.getComments();
	},
};
</script>
