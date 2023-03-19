<template>
	<div class="flex grow justify-start items-start overflow-hidden bg-gray-50 dark:bg-dark-mode-secondary w-full h-full">
		<aside v-if="!isBlacklist" id="sidebar" class="flex fixed top-0 left-0 z-20 flex-col flex-shrink-0 h-full flex transition-width" :class="{ 'w-64': active, 'md:w-16 w-0': !active }" aria-label="Sidebar">
			<div class="flex w-full relative flex-col flex-1 pt-0 min-h-0 bg-white border-solid border-r border-gray-200 dark:bg-dark-mode-primary dark:border-gray-700"  :class="{ 'md:border-solid border-none': !active }">
				<div class="flex overflow-y-auto flex-col flex-1 pt-5 pb-4 w-full">
					<div class="w-full flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700 overflow-hidden">
						<ul class="pb-2 space-y-2">
							<DrawerRouterOption to="/app/account" name="Home" :fold="!active">
								<SvgLogoMinified width="24" height="24"/>
							</DrawerRouterOption>
						</ul>
						<ul class="pt-2 space-y-2">
							<DrawerRouterOption to="/app/agility/dashboard" name="Agility" :fold="!active">
								<SvgProject/>
							</DrawerRouterOption>
							<DrawerRouterOption to="#" name="Edu Scrum" :fold="!active">
								<SvgEduScrum/>
							</DrawerRouterOption>
							<DrawerRouterOption to="/app/materials" name="Inventory" :fold="!active">
								<SvgInventory/>
							</DrawerRouterOption>
							<DrawerRouterOption to="/" name="Blog" :fold="!active">
								<SvgBlog/>
							</DrawerRouterOption>
							<DrawerRouterOption to="/" name="Ressources" :fold="!active">
								<SvgResource/>
							</DrawerRouterOption>
							<DrawerRouterOption to="/" name="Attendance" :fold="!active">
								<SvgQrCode/>
							</DrawerRouterOption>
							<DrawerRouterOption to="/" name="Retrospective" :fold="!active">
								<SvgNote/>
							</DrawerRouterOption>
						</ul>
					</div>
				</div>
				<div class="relative hidden absolute bottom-0 left-0 justify-center p-4 gap-3 w-full md:flex" :class="{ '!flex p-4': active, 'flex-col p-3 flex-col-reverse': !active}" sidebar-bottom-menu="">
					<ButtonIcon>
						<SvgLogout/>
					</ButtonIcon>
					<ButtonIcon @click="themeStore.switchTheme">
						<SvgDark v-if="theme"/>
						<SvgLight v-else/>
					</ButtonIcon>
				</div>
			</div>
		</aside>
		<div id="main-content" class="flex flex-col overflow-y-auto gap-0 relative w-full h-full bg-gray-100 dark:bg-gray-900 overflow-hidden gap-12" :class="{ 'ml-0': isBlacklist, 'md:ml-16': !isBlacklist }">
			<button v-if="!isBlacklist" @click.stop="drawerAction" class="absolute top-4 flex justify-center items-center z-20 bg-white p-1 rounded-lg" :class="{ 'left-[17rem] md:left-52': active, 'left-4': !active }">
				<SvgBurger width="30" height="30" fill="black"/>
			</button>
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import DrawerRouterOption from '@/components/common/drawer/RouterOption.vue';
import ButtonIcon from '@/components/common/buttons/Icon.vue';
import SvgBurger from '@/components/common/svg/Burger.vue';
import SvgLogoMinified from '@/components/common/svg/LogoMinified.vue';
import SvgProject from '@/components/common/svg/Project.vue';
import SvgEduScrum from '@/components/common/svg/EduScrum.vue';
import SvgInventory from '@/components/common/svg/Inventory.vue';
import SvgBlog from '@/components/common/svg/Blog.vue';
import SvgResource from '@/components/common/svg/Resource.vue';
import SvgQrCode from '@/components/common/svg/QrCode.vue';
import SvgNote from '@/components/common/svg/Note.vue';
import SvgDark from '@/components/common/svg/Dark.vue';
import SvgLight from '@/components/common/svg/Light.vue';
import SvgLogout from '@/components/common/svg/Logout.vue';
import { useThemeStore } from '@/store/modules/theme.store';
import { useRoute } from 'vue-router';

const route = useRoute();
const blacklist = [/^\/app\/agility\/project\/([a-z])+/];
const isBlacklist = computed(() => blacklist.some((rgx) => rgx.test(route.path)));

const themeStore = useThemeStore();
const theme = computed(() => themeStore.theme);

const active = ref(false);
const drawerAction = () => {
	active.value = !active.value;
}
</script>