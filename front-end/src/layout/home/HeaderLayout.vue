<template>
	<div class="fixed py-3 px-5 w-full shadow-md z-40 bg-white dark:bg-gray-800">
		<div class="flex justify-between items-center">
			<div class="flex justify-start items-center">
				<RouterLink to="/" class="flex items-center gap-1">
					<SvgLogo class="sm:flex hidden"/>
					<SvgLogoMinified class="sm:hidden"/>
				</RouterLink>
			</div>
			<div class="flex items-center gap-3">
				<ButtonDefault
					to="/signin"
					text="Signin"
					text-style="text-black dark:text-black font-bold text-sm"
					background="bg-white hover:bg-gray-200"
				/>
				<ButtonDefault
					to="/signup"
					text="Signup"
					text-style="text-white dark:text-white font-bold text-sm"
					background="gradiant"
				/>
				<ButtonIcon @click="themeStore.switchTheme">
					<SvgDark v-if="theme"/>
					<SvgLight v-else/>
				</ButtonIcon>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/store/modules/theme.store';
import ButtonIcon from '@/components/common/buttons/Icon.vue';
import ButtonDefault from '@/components/common/buttons/Default.vue';

import SvgLogo from '@/components/common/svg/Logo.vue';
import SvgDark from '@/components/common/svg/Dark.vue';
import SvgLight from '@/components/common/svg/Light.vue';
import SvgLogoMinified from '@/components/common/svg/LogoMinified.vue';

const themeStore = useThemeStore();
const theme = computed(() => themeStore.theme);
</script>
