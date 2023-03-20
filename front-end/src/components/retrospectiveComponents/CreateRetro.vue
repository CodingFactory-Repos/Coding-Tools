<template>
	<div>
		<button @click="chooseTemplate">Créer une nouvelle rétrospective</button>
	</div>
	<div>
		<Overlay v-model:active="active" :fullSize="false">
			<ChooseTemplate />
		</Overlay>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Overlay from '@/components/retrospectiveComponents/utils/Overlay.vue';
import ChooseTemplate from './ChooseTemplate.vue';

export default defineComponent({
	components: {
		Overlay,
		ChooseTemplate,
	},
	setup() {
		const active = ref(false);
		const displayTemplate = ref(false);

		const chooseTemplate = () => {
			active.value = true;
			if (displayTemplate.value === false) {
				displayTemplate.value = true;
			} else {
				displayTemplate.value = false;
			}
		};

		return {
			chooseTemplate,
			displayTemplate,
			active,
		};
	},
});
</script>
