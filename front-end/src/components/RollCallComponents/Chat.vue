<template>
	<div class="chatbox flex-col w-9/12 max-w-9/12 max-h-[750px] relative">
		<div
			class="chatbox_messages h-[750px] max-h-[750px] overflow-y-hidden flex flex-col-reverse z-0"
		>
			<chat-multi-message v-for="message in messages" :key="message.id" :message="message" />
		</div>
		<div class="chatbox_input flex-col">
			<div>
				<div
					class="gif-container flex mt-30 items-center z-10 w-full overflow-x-scroll absolute fixed bottom-0"
				>
					<img
						v-for="gif in gifs"
						:src="gif"
						:key="gif.id"
						class="h-full w-full w-[200px] h-[200px] z-1000"
						@click="sendGifMessage(gif)"
					/>
				</div>
				<input
					v-model="newMessageText"
					@keydown.enter="sendMessage"
					placeholder="Envoyer un message"
					class="w-9/12 text-white max-h-[27.2px] relative"
				/>
				<input
					v-model="searchTerm"
					@keydown.enter="getGifs()"
					placeholder="Cherchez un gif"
					class="w-3/12 text-white max-h-[27.2px]"
				/>
			</div>
		</div>
	</div>
</template>
<script>
import ChatMultiMessage from './ChatMultiMessage.vue';

export default {
	components: {
		ChatMultiMessage,
	},
	data() {
		return {
			messages: [],
			gifmessages: [],
			newMessageText: '',
			searchTerm: '',
			gifs: [],
		};
	},
	methods: {
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
				sender_name: 'philémon' /* user.name */,
				date: this.getDate(),
			};
			this.messages.unshift(newGifMessage);
			this.gifs = [];
			this.searchTerm = '';
		},
		buildGifs(json) {
			this.gifs = json.data
				.map((gif) => gif.id)
				.map((gifId) => {
					return `https://media.giphy.com/media/${gifId}/giphy.gif`;
				});
		},
		getGifs() {
			let apiKey = '12ujTlV1hDN8v0xzjdlyDq2u48DCR1qy';
			let searchEndPoint = 'https://api.giphy.com/v1/gifs/search?';
			let limit = 20;

			let url = `${searchEndPoint}&api_key=${apiKey}&q=${this.searchTerm}&limit=${limit}`;
			console.log(this.searchTerm);

			fetch(url)
				.then((response) => {
					return response.json();
				})
				.then((json) => {
					this.buildGifs(json);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		/*TODO Discuss how to refresh the page and update the conv to display all messages */
		sendMessage() {
			if (!this.newMessageText) return;
			const newMessage = {
				type: 'msg',
				text: this.newMessageText,
				sender_id: 1 /* user.id */,
				sender_name: 'philémon' /* user.name */,
				date: this.getDate(),
			};
			this.messages.unshift(newMessage);
			this.newMessageText = ''; /* reset the message state */
			// if GET getConv(conversation_Id) = undefined / null => POST createConv()
			// PUT Api call on updateConv(conversation_Id, messages)
		},
	},
};
// create conversation (in db ) if there are no messages
//conversation { id pageId(same as QrCode) messagesList{} }
</script>
