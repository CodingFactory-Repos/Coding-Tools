<template>
	<div class="flex grow overflow-hidden pt-16 bg-gray-50 dark:bg-gray-900 w-full">
		<aside id="sidebar" class="flex hidden fixed top-0 left-0 z-20 flex-col flex-shrink-0 pt-16 w-64 h-full duration-75 lg:flex transition-width lg:w-64" :class="{ 'lg:w-64': active, 'lg:w-16': !active }" aria-label="Sidebar">
			<div class="flex relative flex-col flex-1 pt-0 min-h-0 bg-light-primary border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
				<div class="flex overflow-y-auto flex-col flex-1 pt-5 pb-4">
					<div class="flex-1 px-3 space-y-1 bg-light-primary divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700 overflow-hidden">
						<ul class="pb-2 space-y-2">
							<li>
								<DrawerRouterOption to="/home" name="Home" :logo="{ name:'logo', size:'24px', color:'dark:fill-gray-400 fill-[#666666]' }" :fold="!active"/>
							</li>
						</ul>
						<ul class="pt-2 space-y-2">
							<li>
								<DrawerRouterOption to="/agility/dashboard" name="Projects" :logo="{ name: 'project', size: '24px', color:'dark:fill-gray-400 fill-[#666666]' }" :fold="!active"/>
							</li>
							<li>
								<DrawerRouterOption to="/agility/dashboard/documentation" name="Pixi-Tools Documentation" :logo="{ name: 'api', size: '24px', color:'dark:fill-gray-400 fill-[#666666]' }" :fold="!active"/>
							</li>
						</ul>
					</div>
				</div>
				<div class="relative hidden absolute bottom-0 left-0 justify-center p-4 gap-3 w-full lg:flex" :class="{ 'p-4': active, 'flex-col p-3 flex-col-reverse': !active}" sidebar-bottom-menu="">
					<ButtonIcon to="#" :logo="{ name: 'logout', size: '24px', color:'dark:fill-gray-400 fill-[#666666]' }"/>
					<ButtonIcon to="#" :logo="{ name: 'gear', size: '24px', color:'dark:fill-gray-400 fill-[#666666]' }"/>
				</div>
			</div>
		</aside>
		<div id="main-content" class="flex flex-col overflow-y-auto relative w-full h-full bg-gray-50 lg:ml-64 dark:bg-gray-900 overflow-hidden p-6 gap-12" :class="{ 'lg:ml-64': active, 'lg:ml-16': !active }">
			<router-view />
		</div>
	</div>
</template>

<script lang="ts" setup>
import DrawerRouterOption from '@/components/common/drawer/RouterOption.vue';
import ButtonIcon from '@/components/common/buttons/Icon.vue';

defineProps({
	active: { type: Boolean, required: true },
})
</script>