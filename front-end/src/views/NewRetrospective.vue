<template>
	<RetroCanvas/>
</template>

<script lang="ts">
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { defineComponent, onBeforeMount, onMounted } from 'vue';
import RetroCanvas from '@/components/retrospectiveComponents/RetroCanvas.vue';
import { useSocket } from '@/composables/socketRetro';

export default defineComponent({
	components: {
	RetroCanvas
	},
	setup() {
		const retrospectiveStore = useRetrospectiveStore();
		onBeforeMount(() => {
			useSocket();
		});
	},
});
</script>
