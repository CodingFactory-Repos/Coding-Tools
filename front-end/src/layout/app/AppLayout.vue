<template>
	<DrawerLayout />

	<div class="view w-auto text-center pl-[40px]">
		<div class="content !block">
			<router-view></router-view>
		</div>
	</div>
</template>

<script lang="ts" setup>
import DrawerLayout from './DrawerLayout.vue';

// Check the comments at the end of the files in src/components/NavBar.vue
// I did not delete the file because you might have added a few other things.

//! top-0 right-0 w-auto h-screen text-center ml-[40px]
// top-0 and right-0 have no effect unless it's an absolute element
// ml-[40px] : Margin push the whole div to the left (cause a scroll), use pl-[40px] instead
// h-screen = 100vh -> Never use vh, it causes a lot of compatibility issues with safari and iOS phone features
</script>
