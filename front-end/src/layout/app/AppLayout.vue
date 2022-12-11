<template>
	<DrawerLayout/>

	<div class="view top-0 right-0 w-auto h-screen text-center ml-[40px]">
		<div class="content !block">
			<router-view></router-view>
		</div>
	</div>
</template>

<script lang="ts" setup>
import DrawerLayout from './DrawerLayout.vue';

//! Normally it's bad practice to have two element at the root template.
//! But since i don't want to break the css for the nav i won't fix it - Chris.
// Check the comments at the end of the files in src/components/NavBar.vue
// I did not delete the file because you might have added a few other things.
</script>