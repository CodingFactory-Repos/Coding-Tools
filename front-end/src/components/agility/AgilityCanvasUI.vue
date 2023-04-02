<template>
	<div class="w-full h-full flex flex-col gap-0">
		<template v-if="$route.path === '/app/agility/new'">
			<AgilitySceneUI>
				<ToolsEditorUI v-if="!immersion"/>
				<div class="flex w-full h-full relative">
					<DefaultSelectionBoxUI v-if="!immersion"/>
					<MiroSelectionBox v-else/>
					<slot></slot>
				</div>
			</AgilitySceneUI>
		</template>
		<template v-else>
			<div class="flex w-full h-full relative">
				<OldSelectionBox/>
				<slot></slot>
			</div>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useProjectStorev2 } from '@/store/modules/project2.store';

import MiroSelectionBox from '@/components/agility/UI/MiroSelectionBox.vue';
import OldSelectionBox from '@/components/agility/UI/OldSelectionBox.vue';
import ToolsEditorUI from '@/components/agility/UI/ToolsEditor.vue';
import DefaultSelectionBoxUI from '@/components/agility/UI/DefaultSelectionBox.vue';
import AgilitySceneUI from '@/components/agility/UI/SceneUI.vue';

const projectStore = useProjectStorev2();
const immersion = computed(() => projectStore.immersion);
</script>