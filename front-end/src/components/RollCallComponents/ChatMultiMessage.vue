<template>
	<div :class="['message flex-col z-0 ']" v-if="message.type == 'msg'">
		<div class="message_body text-2xl font text-gray-400 text-center">{{ message.text }}</div>
		<div class="sender text-xs text-center">{{ message.sender_name }} {{ message.date }}</div>
	</div>
	<div :class="['message flex-col flex z-0 items-center']" v-else-if="message.type == 'gif'">
		<div class="gif_message_body w-[200px] h-[200px flex align-center]">
			<img :src="message.url" alt="gif" class="w-full h-full" />
		</div>
		<div class="sender text-xs text-center">{{ message.sender_name }} {{ message.date }}</div>
	</div>
</template>
<script>
export default {
	props: {
		message: {
			message: Object,
			required: true,
		},
	},
	data() {
		return {
			fadeOut: false,
		};
	},
	mounted() {
		setTimeout(() => {
			// eslint-disable-next-line vue/no-mutating-props
			this.fadeOut = true;
		}, 2000); // fade out after 2s
	},
};
</script>
<style scoped>
.message {
	transition: opacity 1s;
}

.fade-out {
	opacity: 0;
}
</style>
