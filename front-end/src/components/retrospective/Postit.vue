<template>
	<div
		class="h-48 w-48 flex justify-center items-center bg-gray-50 "
		:draggable="isOwner"
        @dragstart="dragStart()"
        @dragend="dragEnd"
	>
		<div class="text-black">
			{{ postit.value }}
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/store/modules/auth.store';
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { computed } from 'vue';

const props = defineProps({
	postit: { type: Object, required: true}
})
const retroStore = useRetrospectiveStore();
const authStore = useAuthStore();
const isOwner = computed(() => authStore.user.profile.email === props.postit.user ? true : false)

const dragStart = () => {
	// console.log("bonjour");
	// console.log("props", props.postit);
	retroStore.tempMovingPostit = props.postit;

}

const dragEnd = () => {
	console.log("goodbye");

}
</script>