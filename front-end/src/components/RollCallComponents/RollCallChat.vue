<template>
	<div ref="talkjs" style="height: 500px">
		<i>Loading chat...</i>
	</div>
</template>
<script>
import Talk from 'talkjs';
/* TalkJs chat version, not ideal + might be unreliable later on */
export default {
	// eslint-disable-next-line vue/multi-word-component-names
	name: 'Chat',
	data() {
		return {
			// get message history through db
			messageList: [],
		};
	},
	async mounted() {
		await Talk.ready;

		const third = new Talk.User({
			id: '09098',
			name: 'KrukMak',
			email: 'jakub@jakub.mail',
			role: 'default',
		});

		const me = new Talk.User({
			id: '001',
			name: 'Philémax',
			email: 'philemon@oui.oui',
			welcomeMessage: 'Ecrire message svp',
			//The welcomeMessage is the first message any other user will see when they start a chat with this user
			role: 'booker',
		});

		const other = new Talk.User({
			id: '654321',
			name: 'Philémoins',
			email: 'Sebastian@example.com',
			photoUrl: 'https://talkjs.com/images/avatar-5.jpg',
			welcomeMessage: 'Ecrire la con de toi',
			role: 'default',
		});

		const talkSession = new Talk.Session({
			appId: 'tVBikeMj',
			me: me,
		});

		const conversation = talkSession.getOrCreateConversation(Talk.oneOnOneId(me, other));

		conversation.setParticipant(me);
		conversation.setParticipant(other);
		conversation.setParticipant(third);

		var inbox = talkSession.createInbox();
		inbox.select(conversation);

		inbox.mount(this.$refs.talkjs);
	},
	methods: {
		messageHandler() {
			let message = this.$refs.inputMessage.value;
			this.messageList.push(message);
		},
	},
};
</script>
