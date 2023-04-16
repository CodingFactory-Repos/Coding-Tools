<template>
	<div class="w-full h-full flex flex-col gap-0">
		<AgilitySceneUI>
			<ToolsEditorUI v-if="!immersion"/>
			<div class="flex w-full h-full relative">
				<DefaultSelectionBoxUI v-if="!immersion"/>
				<MiroSelectionBox v-else/>
				<slot></slot>
			</div>
		</AgilitySceneUI>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useProjectStore } from '@/store/modules/project.store';

import MiroSelectionBox from '@/components/agility/UI/MiroSelectionBox.vue';
import ToolsEditorUI from '@/components/agility/UI/ToolsEditor.vue';
import DefaultSelectionBoxUI from '@/components/agility/UI/DefaultSelectionBox.vue';
import AgilitySceneUI from '@/components/agility/UI/SceneUI.vue';

const projectStore = useProjectStore();
const immersion = computed(() => projectStore.immersion);
</script>