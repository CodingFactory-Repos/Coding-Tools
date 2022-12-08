<template>
	<div class="page-home">
		<HelloWorld msg="Vite + Vue" />
		<nav class="router">
			<RouterLink to="/organisation" class="routerLink">ORGANISATION</RouterLink>
        </nav>
	</div>
</template>

<script lang="ts" setup>
import HelloWorld from '@/components/HelloWorld.vue';
// import { defineComponent } from 'vue';

// export default defineComponent({
// 	name: "Home",
// })
</script>
