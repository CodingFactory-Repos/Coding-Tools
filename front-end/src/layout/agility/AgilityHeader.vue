<template>
	<div class="fixed py-3 px-3 lg:px-5 lg:pl-3 w-full shadow-md z-40 bg-light-primary  dark:bg-gray-800">
		<div class="flex justify-between items-center">
			<div class="flex justify-start items-center gap-4">
				<ButtonIcon @click.stop="$emit('drawer:action')" :logo="{ name: 'burger', size: '24px', color:'dark:fill-gray-400 fill-[#666666]' }"/>
				<span class="mt-1.5 self-center text-2xl font-semibold whitespace-nowrap dark:text-gray-400">Coding Tools - Agility</span>
			</div>
			<div class="flex items-center gap-1">
				<ButtonIcon @click="switchTheme" :logo="{ name: theme ? 'dark' : 'light', size: '24px', color:'dark:fill-gray-400 fill-[#666666]' }"/>

				<div class="flex items-center">
					<ButtonIcon @click="buttonClicked" :logo="{ name: 'gear', size: '24px', color:'dark:fill-gray-400 fill-[#666666]' }"/>

					<div ref="profile" class="hidden absolute right-0 top-14 z-50 my-4 text-base list-none bg-light-primary rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600" style="transform: translateX(-10%);" id="dropdown-2" data-popper-placement="bottom">
						<div class="py-3 px-4" role="none">
							<p class="text-sm text-gray-900 dark:text-white" role="none">
								Neil Wintson
							</p>
							<p class="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
								neil.wintson@edu.esiee-it.fr
							</p>
						</div>
						<ul class="py-1" role="none">
							<li>
								<RouterLink to="/dashboard/my-dashboard" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Dashboard</RouterLink>
							</li>
							<li>
								<RouterLink to="/dashboard/settings" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Settings</RouterLink>
							</li>
							<li>
								<RouterLink to="/home" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Sign out</RouterLink>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ButtonIcon from '@/components/common/buttons/Icon.vue';

const profile = ref<HTMLButtonElement>();
const theme = ref(false);

const buttonClicked = () => {
	profile.value?.classList.toggle("hidden");
}

const switchTheme = () => {
	document.documentElement.classList.toggle("dark");
	theme.value = !theme.value;
}
</script>