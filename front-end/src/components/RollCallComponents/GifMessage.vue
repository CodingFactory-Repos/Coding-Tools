<template>
	<div class="message">
		<div class="gif_message_body w-50 h-50">
			<img :src="gifMessage.url" alt="gif" class="w-50 h-50" />
		</div>
		<div class="sender text-sm">{{ gifMessage.sender_name }} {{ gifMessage.date }}</div>
	</div>
</template>
<script>
export default {
	props: {
		gifMessage: Object,
	},
};
</script>
