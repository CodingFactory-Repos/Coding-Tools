<template>
	<AgilityCanvas/>
</template>

<script lang="ts" setup>
import AgilityCanvas from '@/components/agility/AgilityCanvas.vue';
import { useAgilityStore } from '@/store/modules/agility.store';

const agilityStore = useAgilityStore();

const meta = {
	snapshot: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png",
	title: "Labday",
	id: "zuiebfiuzbe",
}

agilityStore.metaProjects.push(meta);
</script>