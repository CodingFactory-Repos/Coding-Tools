<template>
	<div class="chatbox flex-col w-4/12 max-h-[750px] relative">
		<div
			class="chatbox_messages h-[750px] max-h-[750px] overflow-y-hidden flex flex-col-reverse z-0"
		>
			<chat-multi-message v-for="message in messages" :key="message.id" :message="message" />
		</div>
		<div class="chatbox_input flex-col w-full">
			<div class="w-full">
				<div
					class="gif-container max-h-[200px] flex mt-30 items-center z-10 w-full overflow-x-scroll absolute fixed bottom-10"
				>
					<img
						v-for="gif in gifs"
						:src="gif"
						:key="gif.id"
						class="w-[200px] h-[200px] z-1000"
						@click="sendGifMessage(gif)"
					/>
				</div>
				<input
					v-model="newMessageText"
					@keydown.enter="sendMessage"
					placeholder="  Envoyer un message"
					class="w-9/12 text-white max-h-[27.2px] relative rounded-tl-full rounded-bl-full"
				/>
				<input
					v-model="searchTerm"
					@keydown.enter="getGifs()"
					placeholder="Gif"
					class="w-3/12 text-white max-h-[27.2px] rounded-br-full rounded-tr-full"
				/>
			</div>
		</div>
	</div>
</template>
<script>
import ChatMultiMessage from './ChatMultiMessage.vue';
import { useAuthStore } from '../../store/modules/auth.store';
import { io } from 'socket.io-client';
import { reactive } from 'vue';

let messagesTab = reactive([]);
const authStore = useAuthStore();
const currentUser = authStore.user;
const socket = io('ws://localhost:8010/chat', {
	transports: ['websocket'],
	withCredentials: true,
	path: '/socket.io',
});

export default {
	components: {
		ChatMultiMessage,
	},
	props: {
		roomId: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			messages: reactive([]),
			newMessageText: '',
			searchTerm: '',
			gifs: [],
		};
	},
  created(){},
	mounted() {
		socket.auth = { roomId: this.roomId };
		socket.connect();
		socket.on('peer-connected', () => {
			// not always on time
			console.log('connected');
		});
		socket.on('peer-chat-message', (data) => {
			console.log('test', data);
			let msg = data[0];
			console.log(msg);
			this.addMessageToArray(msg);
			console.log(77, this.messages);
		});
	},
	methods: {
		addMessageToArray(msg) {
			this.messages.unshift(msg);
		},
		getDate() {
			const current = new Date();
			const date = `${current.getHours()}:${current.getMinutes()} -
			${current.getDate()}/${current.getMonth() + 1}`;
			return date;
		},
		sendGifMessage(url) {
			const newGifMessage = {
				url: url,
				type: 'gif',
				sender_id: 1 /* user.id */,
				sender_name: 'Phi' /* currentUser.profile.firstName user.name */,
				date: this.getDate(),
			};
			this.gifs = [];
			this.searchTerm = '';
			socket.emit('message', newGifMessage);
		},
		buildGifs(json) {
			this.gifs = json.data // ok
				.map((gif) => gif.id)
				.map((gifId) => {
					return `https://media.giphy.com/media/${gifId}/giphy.gif`;
				});
		},
		async getGifs() {
			// not working on keydown fetching on keyup
			console.log(112, 'getGifs');
			this.gifs = [];
			// gets the gifs preview ( limit is the number fo choices available )
			let apiKey = '12ujTlV1hDN8v0xzjdlyDq2u48DCR1qy';
			let searchEndPoint = 'https://api.giphy.com/v1/gifs/search?';
			let limit = 20;

			let url = `${searchEndPoint}&api_key=${apiKey}&q=${this.searchTerm}&limit=${limit}`;
			fetch(url)
				.then(async (response) => {
					let json = await response.json();
					console.log(json);
					return json;
				})
				.then((json) => {
					this.buildGifs(json);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		async sendMessage() {
			console.log(138, 'sendMessage');

			if (!this.newMessageText) return;
			const newMessage = {
				type: 'msg',
				text: this.newMessageText,
				sender_id: 1 /* user.id */,
				sender_name: 'Phi' /*currentUser.profile.firstName,*/,
				date: this.getDate(),
			};
			socket.emit('message', newMessage);
			console.log(this.messages);
			this.newMessageText = ''; /* reset the message state */
		},
	},
};
</script>
