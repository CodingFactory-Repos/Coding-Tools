<template>
	<nav class="bg-gray-50 dark:bg-gray-700 w-full flex justify-center relative">
		<div class="max-w-screen-xl px-4 py-3 mx-auto">
			<div class="flex items-center">
					<DefaultButton
					to="/app/retrospective"
					text="Retrospective"
					text-style="text-white hover:text-white"
					background="gradiant"
					class="h-9 absolute right-2 lg:left-16 lg:right-auto"
				>
					<SvgArrows class="fill-white-icon dark:fill-white-icon"/>
				</DefaultButton>
				<ul class="flex flex-row font-medium mt-0 mr-6 space-x-8 text-sm gap-2">
					<li>
						<button @click="toggleSideBar" class="text-gray-900 dark:text-white hover:underline flex items-center gap-2" aria-current="page">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5S5.5 6.57 5.5 8.5S7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm7.04 6.81c1.16.84 1.96 1.96 1.96 3.44V19h4v-1.75c0-2.02-3.5-3.17-5.96-3.44zM15 12c1.93 0 3.5-1.57 3.5-3.5S16.93 5 15 5c-.54 0-1.04.13-1.5.35c.63.89 1 1.98 1 3.15s-.37 2.26-1 3.15c.46.22.96.35 1.5.35z"/></svg>
							<span class="relative">
								Participants
								<span class="text-[#FFFF] text-xs absolute flex items-center justify-center -bottom-2.5 -right-6 bg-[#e85454] rounded-full w-5 h-5 p-0.5">{{ participants?.length }}</span>
							</span>
						</button>
					</li>
					<li>
						<button
							v-if="isPo"
							@click="openShareModal"
							class="text-gray-900 dark:text-white hover:underline flex items-center gap-2"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path fill="currentColor" d="M13.5 1a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3z"/></svg>
							Share
						</button>
					</li>
					<li>
						<button
							@click="revealPostit"
							class="text-gray-900 dark:text-white hover:underline flex items-center gap-2"
							:class="areStickiesVisible ? 'text-[#07bc0c]' : 'text-[#D61F69]'"
						>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
							<path :fill="areStickiesVisible ? '#07bc0c' : '#D61F69'" d="M3.998 21A.996.996 0 0 1 3 20.007V3.993C3 3.445 3.445 3 3.993 3h16.014c.548 0 .993.447.993.998V16l-5.003 5H3.998ZM5 19h10.169L19 15.171V5H5v14Z"
							/>
						</svg>
							{{ areStickiesVisible ? "Your stickies are public &emsp;" : "Your stickies are private" }}
						</button>
					</li>
				</ul>
			</div>
		</div>
	</nav>
	<ShareRetro
		v-if="isShareModalOpen"
		:currentRetro="currentRetro"
		@close="closeShareModal"
	/>
</template>

<script lang="ts" setup>
import DefaultButton from '@/components/common/buttons/Default.vue';
import SvgArrows from '@/components/common/svg/Arrows.vue';
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { config } from '@/config/config';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/store/modules/auth.store';
import ShareRetro from '@/components/retrospective/utils/ShareRetro.vue';


const retroStore = useRetrospectiveStore();
const authStore = useAuthStore();
const participants = computed(() => retroStore.currentRetro.participants);

const route = useRoute();
const url = `${config.prodSiteUrl}${route.fullPath}`;
const areStickiesVisible = computed(() => Object.values(retroStore.currentRetro.postits).some(array => {
	const isObjectUser = array.find(obj => obj.user === authStore.user.profile.email);
	return isObjectUser && isObjectUser.visible === true;
}))
const isShareModalOpen = ref(false);
const isPo = computed(() => (authStore.user.role === 2 || authStore.user.role === 3) ? true : false);
const currentRetro = computed(() => retroStore.currentRetro)
const closeShareModal = () => { isShareModalOpen.value = false };
const openShareModal = () => { isShareModalOpen.value = true };


const toggleSideBar = () => {
	retroStore.tryToggleSideBar();
}


const revealPostit = () => {
	retroStore.setVisibilityPostit();
}

</script>