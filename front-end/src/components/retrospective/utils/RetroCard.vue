<template>
	<div class="max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{retro.associatedCourse.tag}}</h5>
		<h5 class="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{{retro.title}}</h5>
		<button
			@click="seeRetro"
			class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
			See the retro
			<svg aria-hidden="true" class="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg">
				<path fill-rule="evenodd"
					d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
					clip-rule="evenodd"></path>
			</svg>
		</button>
		<div class="flex justify-center text-black font-thin mt-2 text-sm">
			{{ retro.creator }}
		</div>
		<div class="flex justify-end text-black mt-2 text-sm">
			<div>
				{{ new Date(retro.createdAt).toLocaleDateString("FR-fr") }}
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';


const props = defineProps({
	retro: {type: Object, required: true}
})

const router = useRouter();

const seeRetro = () => {
	router.push(`retrospective/${props.retro.slug}`)

}
</script>