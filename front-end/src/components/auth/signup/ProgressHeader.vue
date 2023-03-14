<template>
	<ol class="w-full flex items-center mb-6 text-sm font-medium text-center mb-10 sm:text-base md:px-8 xl:px-0 justify-center">
		<li class="flex items-center sm:after:content-[''] after:w-12 after:h-1 after:border-b after:border-white after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10">
			<div
				class="text-white flex items-center sm:block after:content-['/'] sm:after:hidden after:mx-2 after:font-light after:text-white"
				:class="{ '!text-[burlywood]': state > 0 }"
			>
				<SvgRoundCheck
					v-if="state > 0"
					class="w-4 h-4 mr-2 sm:mb-3 sm:w-6 sm:h-6 sm:mx-auto"
					:class="{ 'fill-[burlywood]': state > 0 }"
				/>
				<div v-else class="text-white mr-2 sm:mb-3 sm:mx-auto">1</div>
				Profile Info
			</div>
		</li>
		<li class="flex items-center after:content-[''] after:w-12 after:h-1 after:border-b after:border-white after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10">
			<div
				class="text-white flex items-center sm:block after:content-['/'] sm:after:hidden after:mx-2 after:font-light after:text-white"
				:class="{ '!text-[burlywood]': state > 1 }"
			>
				<SvgRoundCheck
					v-if="state > 1"
					class="w-4 h-4 mr-2 sm:mb-3 sm:w-6 sm:h-6 sm:mx-auto"
					:class="{ 'text-[burlywood]': state > 1 }"
				/>
				<div v-else class="text-white mr-2 sm:mb-2 sm:mx-auto">2</div>
				Account Info
			</div>
		</li>
		<li
			class="text-white flex items-center sm:block"
			:class="{ '!text-[burlywood]': state > 2 }"
		>
			<SvgRoundCheck
				v-if="state > 2"
				class="w-4 h-4 mr-2 sm:mb-3 sm:w-6 sm:h-6 sm:mx-auto"
				:class="{ 'text-[burlywood]': state > 2 }"
			/>
			<div v-else class="text-white mr-2 sm:mb-2 sm:mx-auto">3</div>
			Confirmation
		</li>
	</ol>
</template>

<script lang="ts" setup>
import SvgRoundCheck from '@/components/common/svg/RoundCheck.vue';

defineProps({
	state: { type: Number, required: true }
})
</script>