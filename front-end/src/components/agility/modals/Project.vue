<template>
	<ModalOverlay v-if="showMetaModal" @close="beforeModalClose" size="lg">
		<template #body>
			<div class="flex gap-10">
				<form class="flex flex-col gap-3">
					<div class="max-w-[14rem] w-full">
						<input
							@input="updateTitle"
							ref="formTitle"
							:value="meta.title"
							class="w-full bg-transparent dark:text-white border-b border-l-0 border-t-0 border-r-0 pb-1 pl-1 text-2xl font-bold text-black outline-none prevent-border"
							type="text"
							maxlength="25"
						>
					</div>
					<div class="max-w-[14rem] w-full">
						<textarea
							@input="updateDescription"
							ref="formDesc"
							:value="meta.description"
							class="w-full bg-transparent dark:text-white border-b border-l-0 border-t-0 border-r-0 pb-1 pl-1 resize-none text-black outline-none prevent-border"
							placeholder="Short description"
							rows="1"
							maxlength="100"
						></textarea>
					</div>
				</form>
				<div class="flex gap-4 justify-center">
					<div class="h-full flex flex-col justify-end">
						<span class="text-sm">Owner</span>
						<span class="text-sm">Created</span>
						<span class="text-sm">Updated</span>
					</div>
					<div class="h-full flex flex-col justify-end">
						<span class="text-sm text-black dark:text-white">{{ meta.owner }}</span>
						<span class="text-sm text-black dark:text-white">{{ meta.createdAt }}</span>
						<span class="text-sm text-black dark:text-white">{{ meta.updatedAt }}</span>
					</div>
				</div>
			</div>
		</template>
		<template #footer>
			<DefaultButton
				@click="() => isFormValid ? saveProjectMeta() : {}"
				type="button"
				text="Save"
				text-style="text-white hover:text-white"
				background="gradiant"
				:disabled="!isFormValid"
			/>
		</template>
	</ModalOverlay>
	<ModalOverlay v-if="showWarningModal" @close="restoreProjectMeta" size="lg">
		<template #body>
			<div class="flex flex-col gap-4">
				<div class="flex w-full gap-4 justify-center items-center">
					<SvgInfo/>
					<span class="mt-1">You have unsaved changes</span>
				</div>
				<div class="flex w-full justify-center items-center">
					<span class="tex-">Are you sure you want to proceed without saving ?</span>
				</div>
			</div>
		</template>
		<template #footer>
			<div class="flex gap-4 justify-center items-center">
				<DefaultButton
					@click="restoreProjectMeta"
					type="button"
					text="Yes"
					text-style="text-white hover:text-white"
					background="bg-red-600 hover:bg-red-500"
					:disabled="!isFormValid"
				/>

				<DefaultButton
					@click="saveProjectMeta"
					type="button"
					text="No, save the change"
					color="text-white hover:text-white"
					background="bg-blue-600 hover:bg-blue-500"
					:disabled="!isFormValid"
				/>
			</div>
		</template>
	</ModalOverlay>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useProjectStore } from '@/store/modules/project.store';
import DefaultButton from '@/components/common/buttons/Default.vue';
import ModalOverlay from '@/components/common/Modal.vue';
import SvgInfo from '@/components/common/svg/Info.vue';

const emit = defineEmits(['close']);

const projectStore = useProjectStore();
const meta = computed(() => projectStore.meta);

const showMetaModal = ref(false);
const showWarningModal = ref(false);
const isFormValid = ref(true);

const previousMetaTitle = ref<string>(meta.value.title);
const previousMetaDesc = ref<string>(meta.value.description);
const formTitle = ref<HTMLInputElement>();
const formDesc = ref<HTMLTextAreaElement>();

const openMetaModal = () => showMetaModal.value = true;
const closeMetaModal = () => showMetaModal.value = false;
const openWarningModal = () => showWarningModal.value = true;
const closeWarningModal = () => showWarningModal.value = false;

const updateTitle = () => {
	const len = formTitle.value.value.length;
	if (len <= 25 && len >= 1) isFormValid.value = true;
	else isFormValid.value = false;

	projectStore.meta.title = formTitle.value.value;
}

const updateDescription = () => {
	const len = formDesc.value.value.length;
	if (len <= 100) isFormValid.value = true;
	else isFormValid.value = false;

	projectStore.meta.description = formDesc.value.value;
}

const restoreProjectMeta = () => {
	projectStore.meta.title = previousMetaTitle.value;
	projectStore.meta.description = previousMetaDesc.value;

	closeWarningModal();
	emit('close');
}

const saveProjectMeta = () => {
	// API CALL, no need to verify if it fails the user fucked up something and the api will reject anyway.

	if (showMetaModal.value) closeMetaModal();
	if (showWarningModal.value) closeWarningModal();
	emit('close');
}

const beforeModalClose = () => {
	closeMetaModal();

	if (previousMetaTitle.value !== meta.value.title || previousMetaDesc.value !== meta.value.description) {
		openWarningModal();
	} else {
		emit('close');
	}
}

openMetaModal();
</script>