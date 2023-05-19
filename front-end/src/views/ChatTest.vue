<template>
	<Chat :room-id="1" />
</template>
<script lang="ts">
import Chat from '@/components/RollCallComponents/Chat.vue';
// eslint-disable-next-line vue/no-export-in-script-setup
export default {
	components: {
		Chat,
	},
};
</script>
