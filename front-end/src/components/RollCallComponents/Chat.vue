<template>
	<div
		class="chatbox w-1/4 max-h-[400px] bg-transparent flex flex-col fixed bottom-1 right-2 z-100 overscroll-none"
		v-if="courseId != undefined"
	>
		<div class="chatbox_messages h-[400px] overflow-y-scroll flex flex-col-reverse mb-8">
			<chat-multi-message
				v-for="message in messages"
				:key="message.id"
				:message="message"
				:class="['message flex-col z-0']"
			/>
		</div>
		<div class="chatbox_input flex-col w-full absolute bottom-2">
			<div class="w-full">
				<div
					class="gif-container h-[400px] flex z-10 w-[400px] mt-64 overflow-y-scroll"
				>
					<div class="flex flex-wrap justify-center">
						<img
							v-for="gif in gifs"
							:src="gif"
							:key="gif.id"
							class="w-[160px] h-[160px] z-1000 mx-1 my-1"
							@click="sendGifMessage(gif)"
							alt="gif"
						/>
					</div>
				</div>
				<input
					v-model="newMessageText"
					@keydown.enter="sendMessage"
					placeholder="Envoyer un message"
					:class="{
						'w-9/12': !gifSelected,
						'w-3/12': gifSelected,
						'p-2': true,
						'bg-white': true,
						'dark:bg-gray-700': true,
						'text-black': true,
						'placeholder-gray-600': true,
						'dark:placeholder-gray-200': true,
						'dark:text-white': true,
						'max-h-[27.2px]': true,
						relative: true,
						'rounded-tl-full': true,
						'rounded-bl-full': true,
						'rounded-br-full': false,
						'rounded-tr-full': false,
						'transition-all': true,
						'duration-300': true,
						'ease-in-out': true,
					}"
				/>
				<input
					v-model="searchTerm"
					@keydown="getGifs"
					placeholder="Gif"
					:class="{
						'w-3/12': !gifSelected,
						'w-9/12': gifSelected,
						'p-2': true,
						'bg-white': true,
						'dark:bg-gray-700': true,
						'text-black': true,
						'dark:text-white': true,
						'placeholder-gray-600': true,
						'dark:placeholder-gray-200': true,
						'max-h-[27.2px]': true,
						'rounded-br-full': true,
						'rounded-tr-full': true,
						'rounded-tl-full': false,
						'rounded-bl-full': false,
						'transition-all': true,
						'duration-300': true,
						'ease-in-out': true,
					}"
					@focusin="toggleGifSelected"
					@focusout="toggleGifSelected"
				/>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import ChatMultiMessage from './ChatMultiMessage.vue';
import { useAuthStore } from '../../store/modules/auth.store';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import axios, { AxiosError } from 'axios';
import { manager } from '@/api/network/socket.io';
import { http } from '@/api/network/axios';
import { withErrorHandler } from '@/utils/storeHandler';

const props = defineProps<{
	roomId: string;
}>();

const messages = ref<Array<Object>>([]);

const authStore = useAuthStore();
const currentUser = computed(() => authStore.user);
const roomId = computed(() => props.roomId);
const searchTerm = ref('');
const gifs = ref([]);
const newMessageText = ref('');
const courseId = ref();
const count = ref();
const hoverHint = ref(false);
const gifSelected = ref(false);
const searchTimeout = ref(null);

/* SOCKET */

const socket = manager.socket('/chat');

socket.on('peer-connected', (id: string) => {
	console.log('connected', id);
});

socket.on('peer-chat-message', (data: Object) => {
	addMessage(data);
});

onMounted(async () => {
	courseId.value = await getCourseId();
	socket.auth = { roomId: courseId.value.toString() };
	socket.connect();
});

onUnmounted(() => {
	socket.disconnect();
});

/* METHODS */

const addMessage = (msg: Object) => {
	messages.value.unshift(msg);
};

const getCourseId = withErrorHandler(async () => {
	const res = await http.get(`/calls/actual_course/`);
	return res.data.actualCourse;
});
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
		sender_name: currentUser.value.profile.firstName, // needs to have a profile firstName
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
	clearTimeout(searchTimeout.value);
	searchTimeout.value = setTimeout(() => {
		searchGifs();
	}, 1000);
};

const searchGifs = async () => {
	// interval of few seconds before searching to avoid spamming
	let apiKey = '12ujTlV1hDN8v0xzjdlyDq2u48DCR1qy'; // add to .env
	let searchEndPoint = 'https://api.giphy.com/v1/gifs/search?';
	let limit = 40;
	let url = `${searchEndPoint}&api_key=${apiKey}&q=${searchTerm.value}&limit=${limit}`;

	axios
		.get(url)
		.then(async (response) => {
			return await response.data;
		})
		.then((json) => {
			buildGifs(json);
		})
		.catch((err) => {
			console.error(err);
		});
};

const toggleGifSelected = () => {
	gifSelected.value = !gifSelected.value;
};

const sendMessage = async () => {
	if (!newMessageText.value) return;
	const newMessage = {
		type: 'msg',
		text: newMessageText.value,
		sender_id: 1 /* user.id */,
		sender_name: currentUser.value.profile.firstName,
		date: getDate(),
	};
	count.value = count.value + 1;
	addMessage(newMessage);
	let courseId = await getCourseId();
	try {
		await http.post(`/calls/save_message/${courseId}`, { newMessage: newMessage });
	} catch (err) {
		if (err instanceof AxiosError) {
			console.error(189, err.message);
		} else {
			console.error('Unexpected Error : ', err);
		}
	}
	socket.emit('message', newMessage);
	newMessageText.value = ''; /* reset the message state */
};
</script>
