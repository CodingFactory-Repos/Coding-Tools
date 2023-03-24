<template>
	<RetroCanvas/>
</template>

<script lang="ts">
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { defineComponent } from 'vue';
import RetroCanvas from '@/components/retrospectiveComponents/RetroCanvas.vue';

export default defineComponent({
	components: {
    RetroCanvas
},
	setup() {
		const retrospectiveStore = useRetrospectiveStore();
	},
});
</script>
