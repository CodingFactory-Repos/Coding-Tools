<template>
	<div class="ideas-comments mt-4">
		<span class="text-xs !text-opacity-50 text-dark-primary dark-primary dark:text-dark-font"
			>Commentaires :
		</span>
		<form action="" class="flex flex-col" @submit.prevent="postBdd">
			<ul class="py-2.5 border border-dark-font rounded-lg mb-4 mt-2">
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
				<textarea
					class="bg-light-secondary border text-dark-primary sm:text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 mr-4"
					placeholder="Ajouter un commentaire"
					v-model="comment"
					rows="2"
				/>
				<button
					class="rounded-lg p-2.5 font-bold bg-light-icon rounded-lg text-sm focus:outline-none dark:text-dark-font dark:disabled:bg-dark-tertiary dark:disabled:text-dark-icon dark:bg-dark-tertiary disabled:bg-light-tertiary dark:disabled:border-dark-icon bg-light-tertiary text-dark-primary disabled:text-light-font border border-dark-font disabled:border-light-font items-center gap-2"
					:disabled="comment === ''"
					type="submit"
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

import { manager } from '@/api/network/socket.io';

import { useAuthStore } from '@/store/modules/auth.store';

const authStore = useAuthStore();
const userStore = useUserStore();

// const socket = manager.socket('/material');

const user = computed(() => authStore.user);
const userId = computed(() => user.value._id);

const socket = manager.socket('/ideasEquipements');

export default {
	props: ['equipmentId'],
	data() {
		return {
			items: [],
			comment: '', //item before adding into array
			userId,
			socket: null,
		};
	},
	watch: {
		equipmentId: function () {
			this.getComments();
		},
	},
	created() {
		socket.auth = { roomId: this.equipmentId };
		socket.connect();
		socket.on('comment-added', (data) => {
			console.log('comment-added');
			console.log(data);
			this.items = data;
		});

		this.getComments();
	},

	unmounted() {
		socket.disconnect();
	},

	methods: {
		async postBdd() {
			const { comment, equipmentId, userId } = this;
			const { data: items } = await http.post('/ideascomments/add', {
				userId,
				comment,
				equipmentId,
			});
			console.log(items);
			socket.emit('add-comment', items);
			this.items = items || [];
			this.comment = '';
		},
		async getComments() {
			const { comment, equipmentId, userId } = this;
			const body = { comment, equipmentId, userId };
			const { data: items } = await http.get(`/ideascomments/equipment/${equipmentId}`, body);
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
};
</script>
