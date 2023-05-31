<template>
	<nav class="bg-gray-50 dark:bg-gray-700 w-full flex justify-center">
		<div class="max-w-screen-xl px-4 py-3 mx-auto">
			<div class="flex items-center">
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
							@click="copyLink"
							class="text-gray-900 dark:text-white hover:underline flex items-center gap-2"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path fill="currentColor" d="M13.5 1a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3z"/></svg>
							Share
						</button>
					</li>
					<li>
						<a href="#" class="text-gray-900 dark:text-white hover:underline">End Retro</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>

<script lang="ts" setup>
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { config } from '@/config/config';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';


const retroStore = useRetrospectiveStore();
const participants = computed(() => retroStore.currentRetro.participants)
const route = useRoute();
const url = `${config.prodSiteUrl}${route.fullPath}`;

const toggleSideBar = () => {
	retroStore.tryToggleSideBar();
}

const copyLink = () => {
	navigator.clipboard.writeText(url);
	Swal.fire({
		position: 'top-end',
		text: "Url copied !",
		showConfirmButton: false,
		timer: 1500,
		color: '#5c5f73',
		padding: '0em',
		toast: true
	})
}

</script>