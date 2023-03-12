<template>
	<AgilityTemplateDisplay/>
	<AgilityProjectDisplay/>
</template>

<script lang="ts" setup>
import AgilityProjectDisplay from '@/components/agility/AgilityProjectDisplay.vue';
import AgilityTemplateDisplay from '@/components/agility/AgilityTemplateDisplay.vue';
import { useAgilityStore } from '@/store/modules/agility.store';

const agilityStore = useAgilityStore();
agilityStore.tryGetTemplatesMeta();
agilityStore.tryGetProjectsMeta();
</script>