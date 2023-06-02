<template>
	<div class="chatbox w-1/4 max-h-[700px] flex flex-col absolute fixed bottom-1 right-1 z-100">
		<div class="chatbox_messages h-[700px] overflow-y-scroll flex flex-col-reverse mb-8">
			<chat-multi-message
				v-for="message in messages"
				:key="message.id"
				:message="message"
				:class="['message flex-col z-0']"
			/>
		</div>
		<div class="chatbox_input flex-col w-full absolute fixed bottom-2">
			<div class="w-full">
				<div
					class="gif-container max-h-[200px] flex items-center z-10 w-full overflow-x-scroll absolute fixed bottom-7"
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
<script setup lang="ts">
import ChatMultiMessage from './ChatMultiMessage.vue';
import { useAuthStore } from '../../store/modules/auth.store';
import { io } from 'socket.io-client';
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import axios from 'axios';
import { manager } from '@/api/network/socket.io';
import { http } from '@/api/network/axios';
import { withErrorHandler } from '@/utils/storeHandler';

const props = defineProps<{
	roomId: string;
}>();

const messages = ref<Array<Object>>([]);

const authStore = useAuthStore();
const currentUser = computed(() => authStore.user);
const roomId = computed(() => props.roomId); // roomId = CourseId
const searchTerm = ref('');
const gifs = ref([]);
const newMessageText = ref('');
const courseId = ref();
const count = ref();

/* SOCKET */

const socket = manager.socket('/chat');

socket.on('peer-connected', (id: string) => {
	console.log('connected', id);
});

socket.on('peer-chat-message', (data: Object) => {
	console.log('test', data);
	let msg = data;
	console.log(72, msg);
	addMessage(msg);
	console.log(77, messages.value);
});

onMounted(async () => {
	courseId.value = await getCourseId();
	console.log(79, courseId.value);
	socket.auth = { roomId: roomId.value.toString() };
	socket.connect();
});

onUnmounted(() => {
	socket.disconnect();
});

/* METHODS */

const addMessage = async (msg: Object) => {
	messages.value.unshift(msg);
	let courseId = await getCourseId();
	console.log(89, courseId);
	await http
		.post(`/calls/save_message/${courseId}`, { newMessage: msg })
		.then((response) => console.log(92, response))
		.catch((error) => console.error(error));
};

const getCourseId = withErrorHandler(async () => {
	http.get(`/calls/actual_course/`).then((response) => {
		console.log(98, response);
		return response.data.actualCourse;
	});
});

// const getMessages = withErrorHandler(async () => {
// 	if (!courseId) {
// 		await getCourseId();
// 	}
// 	await http.get(`/calls/get_messages/${courseId}`);
// });
const getDate = () => {
	const current = new Date();
	const date = `${current.getHours()}:${current.getMinutes()} -
			${current.getDate()}/${current.getMonth() + 1}`;
	return date;
};

const sendGifMessage = (url: string) => {
	const newGifMessage = {
		url: url,
		type: 'gif',
		sender_id: 1 /* user.id */,
		sender_name: currentUser.value.profile.firstName,
		date: getDate(),
	};
	gifs.value = [];
	searchTerm.value = '';
	count.value = count.value + 1;
	addMessage(newGifMessage);
	socket.emit('message', newGifMessage);
};

const buildGifs = (json: any) => {
	gifs.value = json.data.map((gif) => `https://media.giphy.com/media/${gif.id}/giphy.gif`);
};

const getGifs = async () => {
	console.log(114, 'getGifs');
	gifs.value = []; // gets the gif preview

	let apiKey = '12ujTlV1hDN8v0xzjdlyDq2u48DCR1qy'; // add to .env
	let searchEndPoint = 'https://api.giphy.com/v1/gifs/search?';
	let limit = 20;
	let url = `${searchEndPoint}&api_key=${apiKey}&q=${searchTerm.value}&limit=${limit}`;

	axios
		.get(url)
		.then(async (response) => {
			console.log(response.data);
			let json = await response.data;
			console.log(json);
			return json;
		})
		.then((json) => {
			buildGifs(json);
		})
		.catch((err) => {
			console.log(err);
		});
};

const sendMessage = async () => {
	console.log(139, 'sendMessage');
	if (!newMessageText.value) return;
	const newMessage = {
		type: 'msg',
		text: newMessageText.value,
		sender_id: 1 /* user.id */,
		sender_name: 'Phi' /* currentUser.value.profile.firstName */,
		date: getDate(),
	};
	count.value = count.value + 1;
	addMessage(newMessage);
	socket.emit('message', newMessage);
	console.log(151, messages.value);
	newMessageText.value = ''; /* reset the message state */
};

// export default {
// 	components: {
// 		ChatMultiMessage,
// 	},
// 	props: {
// 		roomId: {
// 			type: String,
// 			required: true,
// 		},
// 	},
// 	methods: {
// 		getDate() {
// 			const current = new Date();
// 			const date = `${current.getHours()}:${current.getMinutes()} -
// 			${current.getDate()}/${current.getMonth() + 1}`;
// 			return date;
// 		},
// 		sendGifMessage(url) {
// 			const newGifMessage = {
// 				url: url,
// 				type: 'gif',
// 				sender_id: 1 /* user.id */,
// 				sender_name: 'Phi' /* currentUser.profile.firstName user.name */,
// 				date: this.getDate(),
// 			};
// 			this.gifs = [];
// 			this.searchTerm = '';
// 			socket.emit('message', newGifMessage);
// 		},
// 		buildGifs(json) {
// 			this.gifs = json.data // ok
// 				.map((gif) => gif.id)
// 				.map((gifId) => {
// 					return `https://media.giphy.com/media/${gifId}/giphy.gif`;
// 				});
// 		},
// 		async getGifs() {
// 			// not working on keydown fetching on keyup
// 			console.log(112, 'getGifs');
// 			this.gifs = [];
// 			// gets the gifs preview ( limit is the number fo choices available )
// 			let apiKey = '12ujTlV1hDN8v0xzjdlyDq2u48DCR1qy';
// 			let searchEndPoint = 'https://api.giphy.com/v1/gifs/search?';
// 			let limit = 20;
//
// 			let url = `${searchEndPoint}&api_key=${apiKey}&q=${this.searchTerm}&limit=${limit}`;
// 			fetch(url)
// 				.then(async (response) => {
// 					let json = await response.json();
// 					console.log(json);
// 					return json;
// 				})
// 				.then((json) => {
// 					this.buildGifs(json);
// 				})
// 				.catch((err) => {
// 					console.log(err);
// 				});
// 		},
// 		async sendMessage() {
// 			console.log(138, 'sendMessage');
//
// 			if (!this.newMessageText) return;
// 			const newMessage = {
// 				type: 'msg',
// 				text: this.newMessageText,
// 				sender_id: 1 /* user.id */,
// 				sender_name: 'Phi' /*currentUser.profile.firstName,*/,
// 				date: this.getDate(),
// 			};
// 			socket.emit('message', newMessage);
// 			console.log(this.messages);
// 			this.newMessageText = ''; /* reset the message state */
// 		},
// 	},
// };
</script>
