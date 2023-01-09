<template>
	<AgilityHeader @drawer:action="drawerAction"/>
	<AgilityDrawer :active="isOpen">
		<div class="pages">
			<router-view />
		</div>
	</AgilityDrawer>
</template>


<script lang="ts" setup>
import { ref } from 'vue';
import AgilityHeader from './AgilityHeader.vue';
import AgilityDrawer from './AgilityDrawer.vue';

const isOpen = ref(true);

const drawerAction = () => {
	isOpen.value = !isOpen.value;
}
</script>