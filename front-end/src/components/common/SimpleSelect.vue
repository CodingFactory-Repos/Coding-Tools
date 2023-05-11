<template>
	<div class="w-full" ref="element">
		<label id="listbox-label" class="block text-sm leading-5 font-medium text-gray-700">
			<slot name="SelectLabel"></slot>
		</label>
		<div class="relative">
			<div class="inline-block w-full rounded-md shadow-sm">
				<button
					type="button"
					@click="toggle"
					aria-haspopup="listbox"
					aria-expanded="true"
					aria-labelledby="listbox-label"
					class="cursor-pointer relative w-full min-h-[36px] rounded-md border border-[#6B7280] py-1.5 px-2 pr-6 text-left focus:outline-none focus:border-[#1C64F2] transition ease-in-out duration-150 sm:text-sm sm:leading-5"
				>
					<div class="flex items-center gap-2 flex-wrap">
						<span class="block truncate" v-if="!multy">
							{{ value }}
						</span>
						<span 
							v-else
							v-for="(selected, index) in value"
							:key="`${selected}_${index}`"
							class="flex items-center justify-center gap-1.5 bg-[#b54593] px-[5px] py-[1px] rounded"
						>
							{{ selected }}
							<SvgCross class="!fill-white" width="12" height="12" @click="(e: MouseEvent) => unselect(e, selected)"/>
						</span>
					</div>
					<span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
						<SvgExpandArrow width="17" height="17"/>
					</span>
				</button>
			</div>

			<div v-show="active" class="absolute mt-1 w-full rounded-md bg-light-tertiary dark:bg-dark-tertiary border border-[#6B7280] shadow-lg z-20">
				<ul
					tabindex="-1"
					role="listbox"
					aria-labelledby="listbox-label"
					aria-activedescendant="listbox-item-3"
					class="max-h-56 rounded-md text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
				>
					<li
						tabindex="0"
						role="option"
						v-for="(option, index) in trimedData"
						@click="select(option)"
						:key="`${option}_${index}`"
						:id="`listbox-item-${option}-${index}`"
						class="select-none relative py-2 pl-3 pr-9 cursor-pointer hover:bg-light-primary dark:hover:bg-dark-highlight focus:outline-none focus:text-white focus:bg-indigo-600"
					>
						<div class="flex items-center space-x-3">
							<span
								class="block truncate text-ligh-font dark:text-dark-font hover:!text-white"
								:class="{ 'font-normal' : !isSelected(option) , 'font-semibold' : isSelected(option)}"
							>
								{{ option }}
							</span>
						</div>

						<span v-show="isSelected(option)" class="absolute inset-y-0 right-0 flex items-center pr-4">
							<SvgRoundCheck class="!fill-[#b54593]"/>
						</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import SvgExpandArrow from '@/components/common/svg/ExpandArrow.vue';
import SvgRoundCheck from '@/components/common/svg/RoundCheck.vue';
import { useSelect } from '@/composables/useSelect';
import { computed } from 'vue';
import SvgCross from '@/components/common/svg/Cross.vue';

const { toggle, close, active, element } = useSelect();

const props = defineProps<{
	data: Readonly<Array<string>>,
	value: string | Array<string>,
	multy?: boolean,
}>();

if(props.multy && typeof props.value === "string") {
	console.error(new TypeError("Multi selector is enabled, but the value is not an array"))
}

const trimedData = computed(() => props.data.filter((el) => {
	if(props.multy) {
		return !props.value.includes(el);
	} else {
		return el !== props.value
	}
}))

const emits = defineEmits<{
	(e: 'selected', value: string);
	(e: 'unselect', value: string);
}>();

const isSelected = (value: string) => {
	if(!props.multy) {
		return props.value === value;
	} else {
		return props.value.includes(value);
	}
}

const unselect = (e: MouseEvent, value: string) => {
	e.stopPropagation();
	emits('unselect', value);
}

const select = (value: string) => {
	if(!props.multy) close();
	emits('selected', value);
}
</script>