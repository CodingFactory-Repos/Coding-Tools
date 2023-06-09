<template>
	<div class="w-full flex flex-col gap-4 h-full justify-start items-start mx-5 mt-16">
		<h1 class="text-2xl font-bold text-[#5c5f73] dark:text-dark-font">All retrospectives</h1>
		<div class="w-full flex grow relative items-center justify-center">
			<div
				class="flex flex-col items-center justify-center gap-5 p-4 z-10 bg-light-primary dark:bg-dark-tertiary rounded-lg"
			>
				<h3 class="text-lg font-bold text-[#5c5f73] dark:text-dark-font text-center">
					Your saved retros will be shown here in the future.
				</h3>
				<DefaultButton
					v-if="isPO"
					type="button"
					text="Start your first retro here!"
					background="bg-pink-600"
					text-style="text-white"
					@click="chooseTemplate"
				/>
				<div v-else class="text-red-500 font-bold">You are not a product owner.</div>
			</div>
		</div>
		<div class="w-full flex grow gap-3 flex-wrap">
			<Overlay v-model:active="active" :fullSize="false">
				<ChooseTemplate :allCourses="allCourses"/>
			</Overlay>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted } from 'vue';
import Overlay from '@/components/retrospective/utils/Overlay.vue';
import ChooseTemplate from './ChooseTemplate.vue';
import DefaultButton from '@/components/common/buttons/Default.vue';
import { useCourseStore } from '@/store/course.store';
import { useAuthStore } from '@/store/modules/auth.store';
import { Roles } from '@/store/interfaces/auth.interfaces';
import { http } from '@/api/network/axios';

export default defineComponent({
	components: {
		DefaultButton,
		Overlay,
		ChooseTemplate,
	},
	setup() {
		const courseStore = useCourseStore();
		const authStore = useAuthStore();
		const active = ref(false);
		const displayTemplate = ref(false);
		const isPO = computed(() => authStore.user.role === Roles.USER ? false : true);
		const allCourses = computed(() => courseStore.allCourses);

		const chooseTemplate = () => {
			active.value = true;
			if (displayTemplate.value === false) {
				displayTemplate.value = true;
			} else {
				displayTemplate.value = false;
			}
		};

		onMounted(async() => {
			await isProductOwner();
		})

		const isProductOwner = async () => {
			// Je vois avec Louis ce qu'il veut faire parce que pas compris, bref
			// Utiliser une fonction fléchée
			try {
				const response = await http.get(`/calls/is_product_owner/`);
				// TODO: Kevin - Ici, il faut définir la valeur de isPO (Kevin met en anglais ton commentaire sinon baston)
				// this.isPO = response.data.isPO;
				isPO.value = true;
			} catch (error) {
				console.error(error);
				// this.isPO = false;
				isPO.value = true;
			}
		};

		return {
			chooseTemplate,
			displayTemplate,
			active,
			isPO,
			allCourses
		};
	},
});
</script>
