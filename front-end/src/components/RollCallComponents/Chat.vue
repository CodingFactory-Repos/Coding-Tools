<template>
	<div class="chatbox flex-col min-w-[600px] max-w-[600px]">
		<div class="chatbox_messages h-96 overflow-y-hidden flex flex-col-reverse">
			<message v-for="message in messages" :key="message.id" :message="message" />
		</div>

		<div class="chatbox_input">
			<input
				v-model="newMessageText"
				@keydown.enter="sendMessage"
				placeholder="Envoyer un message"
				class="min-w-full text-justify text-white"
			/>
		</div>
	</div>
</template>
<script>
import Message from './ChatMessage.vue';

export default {
	components: {
		Message,
	},
	data() {
		return {
			messages: [],
			newMessageText: '',
		};
	},
	methods: {
		getDate() {
			const current = new Date();
			const date = `${current.getHours()}:${current.getMinutes()} -
			${current.getDate()}/${current.getMonth() + 1}`;
			return date;
		},
		/*TODO Discuss how to refresh the page and update the conv to display all messages */
		sendMessage() {
			if (!this.newMessageText) return;
			const newMessage = {
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
