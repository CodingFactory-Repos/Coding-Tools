<template>
	<div class="flex h-full flex-col gap-3 w-full sm:w-fit">
		<div class="h-full flex flex-col rounded-lg bg-light-primary dark:bg-dark-highlight min-w-[300px] min-h-[388px] overflow-y-scroll p-2 w-full">
			<span class="w-full flex justify-center text-sm pb-2 text-black dark:text-white bold">{{ groupName }}</span>
			<hr class="w-full pb-4 dark:border-dark-tertiary"/>
			<template v-if="relatedProfiles.length > 0">
				<div
					v-for="(relatedUser, index) in relatedProfiles"
					:key="`related_user_${index}`"
					@click="viewRelatedUserProfile(relatedUser.id)"
					class="px-2 py-2 w-full flex gap-5 items-center bg-light-secondary dark:bg-dark-tertiary rounded-lg cursor-pointer hover:scale-[1.02] transition-transform"
				>
					<img
						:src="relatedUser.picture || '/template-no-image.png'"
						class="w-12 h-12 rounded-full border border-dark-secondary"
						alt="profile_picture"
					/>
					<span class="bold text-sm text-black dark:text-white">{{ relatedUser.firstName + " " + relatedUser.lastName }}</span>
				</div>
			</template>
			<div v-else class="w-full h-full flex justify-center items-center">
				No related profile found..
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { UserProfileList } from '@/store/interfaces/user.interface';

defineProps<{
	groupName: string;
	relatedProfiles: Array<UserProfileList>;
}>();

const router = useRouter();
const viewRelatedUserProfile = (id: string) => {
	router.push(`/app/account/${id}`);
}

</script>