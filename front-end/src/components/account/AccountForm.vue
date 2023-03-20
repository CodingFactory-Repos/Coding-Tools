<template>
	<div class="py-8 flex flex-col">
		<span class="text-ligh-font dark:text-dark-font pb-4">Work in progress...</span>
		<ButtonDefault
			@click="$emit('edit')"
			text="Go back"
			class="w-full"
			background="bg-light-primary"
			text-style="text-black"
		/>
	</div>
</template>

<script lang="ts" setup>
import { UserBusinessProfile, UserProfile, UserSchoolProfile } from '@/store/interfaces/auth.interfaces';
import ButtonDefault from '@/components/common/buttons/Default.vue';

const props = defineProps<{
	profile: UserProfile,
	schoolProfile: UserSchoolProfile,
	businessProfile: UserBusinessProfile,
}>();
</script>