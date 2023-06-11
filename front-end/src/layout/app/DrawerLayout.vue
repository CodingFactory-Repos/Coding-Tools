<template>
	<div
		class="flex grow justify-start items-start overflow-hidden bg-light-primary dark:bg-dark-primary w-full h-full"
	>
		<aside
			v-if="!isBlacklist"
			id="sidebar"
			class="flex fixed top-0 left-0 z-20 flex-col flex-shrink-0 h-full transition-width bg-light-primary dark:bg-dark-primary z-50"
			:class="{ 'w-64': active, 'md:w-16 w-0': !active }"
			aria-label="Sidebar"
		>
			<div
				class="flex w-full relative flex-col flex-1 pt-0 min-h-0 border-solid border-r boder-light-secondary dark:border-dark-tertiary"
				:class="{ 'md:border-solid border-none': !active }"
			>
				<div class="flex overflow-y-auto flex-col flex-1 pt-5 pb-4 w-full">
					<div
						class="w-full flex-1 px-3 space-y-1 divide-y divide-white-tertiary dark:divide-dark-tertiary overflow-hidden"
					>
						<div class="pb-2 space-y-2">
							<DrawerRouterOption to="/app/account" name="Home" :fold="!active">
								<SvgLogoMinified width="24" height="24" />
							</DrawerRouterOption>
						</div>
						<div class="pt-2 space-y-2">
							<DrawerRouterOption to="/app/agility/dashboard" name="Agility" :fold="!active">
								<SvgProject
									:class="{
										'fill-selected-icon dark:fill-selected-icon':
											route.path.startsWith('/app/agility'),
									}"
								/>
							</DrawerRouterOption>
							<DrawerRouterOption to="/app/scrum" name="Edu Scrum" :fold="!active">
								<SvgEduScrum
									:class="{
										'fill-selected-icon dark:fill-selected-icon':
											route.path.startsWith('/app/scrum'),
									}"
								/>
							</DrawerRouterOption>
							<DrawerRouterOption to="/app/materials" name="Inventory" :fold="!active">
								<SvgInventory
									:class="{
										'fill-selected-icon dark:fill-selected-icon':
											route.path.startsWith('/app/materials'),
									}"
								/>
							</DrawerRouterOption>
							<DrawerRouterOption to="/app/blog" name="Blog" :fold="!active">
								<SvgBlog
									:class="{
										'fill-selected-icon dark:fill-selected-icon':
											route.path.startsWith('/app/blog'),
									}"
								/>
							</DrawerRouterOption>
							<DrawerRouterOption to="/app/ressource" name="Ressources" :fold="!active">
								<SvgResource
									:class="{
										'fill-selected-icon dark:fill-selected-icon':
											route.path.startsWith('/app/ressource'),
									}"
								/>
							</DrawerRouterOption>
							<div v-if="!isPedago">
								<DrawerRouterOption to="/app/rollcall" name="Attendance" :fold="!active">
									<SvgQrCode
										:class="{
											'fill-selected-icon dark:fill-selected-icon':
												route.path.startsWith('/app/rollcall'),
										}"
									/>
								</DrawerRouterOption>
							</div>
							<DrawerRouterOption to="/app/retrospective" name="Retrospective" :fold="!active">
								<SvgNote
									:class="{
										'fill-selected-icon dark:fill-selected-icon':
											route.path.startsWith('/app/retrospective'),
									}"
								/>
							</DrawerRouterOption>
						</div>
					</div>
				</div>
				<div
					class="relative hidden absolute bottom-0 left-0 justify-center gap-3 w-full md:flex"
					:class="{ '!flex p-4': active, 'flex-col p-3 flex-col-reverse': !active }"
					sidebar-bottom-menu=""
				>
					<ButtonIcon @click="openLogoutModal">
						<SvgLogout />
					</ButtonIcon>
					<ButtonIcon @click="themeStore.switchTheme">
						<SvgDark v-if="theme" />
						<SvgLight v-else />
					</ButtonIcon>
				</div>
			</div>
		</aside>
		<div
			id="main-content"
			class="flex flex-col overflow-y-auto gap-0 relative w-full h-full overflow-hidden gap-12 bg-light-secondary dark:bg-dark-primary"
			:class="{ 'ml-0': isBlacklist, 'md:ml-16': !isBlacklist }"
		>
			<button
				v-if="!isBlacklist"
				@click.stop="drawerAction"
				class="fixed top-4 flex justify-center items-center z-20 bg-light-primary dark:bg-dark-tertiary p-1 rounded-lg"
				:class="{ 'left-[17rem] md:left-68': active, 'left-4 md:left-20': !active }"
			>
				<SvgBurger width="30" height="30" fill="black" />
			</button>

			<slot></slot>
		</div>
		<ModalLogout v-if="modalLogoutActive" @close="closeLogoutModal" />
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useThemeStore } from '@/store/modules/theme.store';
import DrawerRouterOption from '@/components/common/drawer/RouterOption.vue';
import ModalLogout from '@/components/auth/ModalLogout.vue';

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
import { http } from '@/api/network/axios';

const route = useRoute();
const themeStore = useThemeStore();

// BlackList is an array of regex where the drawer is hidden;
const blacklist = [/^\/app\/agility\/project\/([a-z-0-9])+/];

const isBlacklist = computed(() => blacklist.some((rgx) => rgx.test(route.path)));
const theme = computed(() => themeStore.theme);
const active = ref(false);
const modalLogoutActive = ref(false);
const isPedago = ref(false);

onMounted(() => {
	getIsPedago();
});

const getIsPedago = async () => {
	try {
		isPedago.value = await http.get(`/calls/is_pedagogue/`);
	} catch (error) {
		console.log(error);
	}
};

const drawerAction = () => {
	active.value = !active.value;
};

const openLogoutModal = () => {
	modalLogoutActive.value = true;
};

const closeLogoutModal = () => {
	modalLogoutActive.value = false;
};
</script>
