<template>
	<div class="w-full h-full flex flex-col gap-10 pt-20 p-4">
		<AgilityTemplateDisplay/>
		<AgilityProjectDisplay/>
	</div>
</template>

<script lang="ts" setup>
import AgilityProjectDisplay from '@/components/agility/AgilityProjectDisplay.vue';
import AgilityTemplateDisplay from '@/components/agility/AgilityTemplateDisplay.vue';
import { useAgilityStore } from '@/store/modules/agility.store';

const agilityStore = useAgilityStore();
agilityStore.tryGetTemplatesMeta();
await agilityStore.tryGetProjectsMeta();
</script>