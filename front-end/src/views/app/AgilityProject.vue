<template>
	<div class="w-full h-full flex flex-col gap-0">
		<AgilityCanvas/>
	</div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-dom';
import AgilityCanvas from '@/components/agility/AgilityCanvas.vue';
import { useAgilityStore } from '@/store/modules/agility.store';

export default defineComponent({
	components: {
		AgilityCanvas,
	},
	async beforeRouteEnter(to, _, next) {
		try {
			const agilityStore = useAgilityStore();
			const roomId = to.path.match(/[^/]+$/)[0];
			const res = await agilityStore.tryGetRoomAccess(roomId);
			if(res) {
				agilityStore.tryGetRoomProject(roomId);
				next();
			}
			else next('/app/agility/dashboard');
		} catch(err) {
			next('/app/agility/dashboard');
		}
	},
	async setup() {
		const agilityStore = useAgilityStore();
		await agilityStore.tryGetProjectsMeta();
	}
})
</script>