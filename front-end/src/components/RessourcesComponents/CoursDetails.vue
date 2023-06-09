<template>
	<div v-if="Object.keys(course.oneItems).length > 0">
		<div class="text-center pt-4">
			<h1 class="text-4xl font-bold">{{ courseById.tag }}</h1>
		</div>
		<img
			class="cover h-72 w-screen object-cover object-center"
			:src="
				courseById.picture && courseById.picture != ''
					? courseById.picture
					: 'https://cdn.discordapp.com/attachments/894865078824890408/1073218625718198342/Fof04PpacAQePOW.png'
			"
			alt=""
		/>
		<div class="pt-3 pb-2">
			<span
				class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
				>{{ courseById.periodStart }}</span
			>
		</div>
		<div class="pt-3 pb-2">
			<span
				class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
				>{{ courseById.periodEnd }}</span
			>
		</div>
		<button
			type="button"
			@click="
				() => {
					router.push('/app/ressource/cours');
				}
			"
		>
			Retour
		</button>
		<div class="flex bg-slate-300 w-full gap-4 justify-center" v-if="canvas.length > 0">
			<div v-for="canva in canvas">
				<button
					@click="goToProject(canva)"
					class="gradiant left-4 bottom-0 md:bottom-[unset] bg-[#24292E] hover:bg-[#24292E99] shadow rounded-lg p-4"
				>
					{{ canva.meta.title }}
				</button>
			</div>
		</div>
		<div class="flex bg-slate-400 w-full gap-4 justify-center mt-4" v-if="retro">
				<button
					@click="goToRetro(retro)"
					class="gradiant left-4 bottom-0 md:bottom-[unset] bg-[#24292E] hover:bg-[#24292E99] shadow rounded-lg p-4"
				>
					{{ retro.title }}
				</button>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { useCoursStore } from '@/store/modules/course.store';
import { useRouter } from 'vue-router';

// get store
const course = useCoursStore();
const courseById = computed(() => course.oneItems.course);
const retro = computed(() => course.oneItems.retro);
const canvas = computed(() => course.oneItems.projects);

const router = useRouter();

// get id from url
const _id = computed(() => {
	const url = window.location.href;
	const id = url.substring(url.lastIndexOf('/') + 1);
	return id;
});

// get openHouse by id
const getCourseById = async (_id: string) => {
	await course.getCourseById(_id);
};

// fetch openHouse data on mounted
onMounted(() => {
	getCourseById(_id.value);
});

const goToProject = (canva) => {
	router.push(`/app/agility/project/${canva._id}`)
};

const goToRetro = (retro) => {
	router.push(`/app/retrospective/${retro.slug}`)
}

</script>
<style scoped>
.display {
	display: block;
}
.display-none {
	display: none;
}
</style>
