<template>
	<!-- TODO: set appear better if time -->
	<div v-if="isShown" class="flex flex-col w-full min-h-[36rem] max-h-[38rem] gap-2 px-2">
		<div class="relative">
			<h1 class="text-2xl font-bold text-[#5c5f73] dark:text-dark-font">Participants</h1>
			<button

				@click="closeSide"
				class="text-black absolute top-1.5 right-1"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 11 11"><path d="M2.2 1.19l3.3 3.3L8.8 1.2a.67.67 0 0 1 .5-.2a.75.75 0 0 1 .7.7a.66.66 0 0 1-.2.48L6.49 5.5L9.8 8.82c.13.126.202.3.2.48a.75.75 0 0 1-.7.7a.67.67 0 0 1-.5-.2L5.5 6.51L2.21 9.8a.67.67 0 0 1-.5.2a.75.75 0 0 1-.71-.71a.66.66 0 0 1 .2-.48L4.51 5.5L1.19 2.18A.66.66 0 0 1 1 1.7a.75.75 0 0 1 .7-.7a.67.67 0 0 1 .5.19z" fill="#5c5f73"/></svg>
			</button>
		</div>
		<div class="flex flex-col overflow-y-scroll overflow-x-hidden items-center gap-1">
			<div v-for="(participant, index) in participants" class="text-black h-full break-all flex w-full justify-between" :key="index">
				<div >
					{{ participant }}
				</div>
				<button
					v-if="isPo && participant !== authStore.user.profile.email"
					@click="removeUserAccess(participant)"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 11 11"><path d="M2.2 1.19l3.3 3.3L8.8 1.2a.67.67 0 0 1 .5-.2a.75.75 0 0 1 .7.7a.66.66 0 0 1-.2.48L6.49 5.5L9.8 8.82c.13.126.202.3.2.48a.75.75 0 0 1-.7.7a.67.67 0 0 1-.5-.2L5.5 6.51L2.21 9.8a.67.67 0 0 1-.5.2a.75.75 0 0 1-.71-.71a.66.66 0 0 1 .2-.48L4.51 5.5L1.19 2.18A.66.66 0 0 1 1 1.7a.75.75 0 0 1 .7-.7a.67.67 0 0 1 .5.19z" fill="#D61F69"/></svg>
				</button>
			</div>
		</div>

	</div>
</template>

<script lang="ts" setup>
import { apiTryRemoveRetroUserAccess } from '@/api/retrospective-req';
import { useAuthStore } from '@/store/modules/auth.store';
import { useRetrospectiveStore } from '@/store/retrospective.store';
import Swal from 'sweetalert2';
import { computed } from 'vue';


const authStore = useAuthStore();
const retroStore = useRetrospectiveStore();
const participants = computed(() => retroStore.currentRetro.participants)
const isShown = computed(() => retroStore.isSideBar)
const isPo = computed(() => (authStore.user.role === 2 || authStore.user.role === 3) ? true : false);

const closeSide = () => {
	retroStore.tryCloseSideBar()
}

const removeUserAccess = (participant: string) => {

	Swal.fire({
		title: `Are you sure to remove acces to ${participant}`,
		showDenyButton: true,
		showCancelButton: false,
		confirmButtonText: "Yes",
		denyButtonText: "No",
		width: "auto"
	}).then((result) => {
		if (result.isConfirmed) {
			apiTryRemoveRetroUserAccess(participant, retroStore.currentRetro.slug);
		}
	})
}
</script>