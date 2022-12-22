<template>
	<div><PixieLayout /></div>
</template>

<script lang="ts">
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { defineComponent } from 'vue';
import PixieLayout from '@/components/retrospectiveComponents/PixieLayout.vue';

export default defineComponent({
	components: {
		PixieLayout,
	},
	setup() {
		const retrospectiveStore = useRetrospectiveStore();
	},
});
</script>
