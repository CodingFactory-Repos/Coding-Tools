<template>
	<div class="fixed z-10 inset-0 overflow-y-auto">
		<div class="flex justify-center items-center min-h-screen">
		<div class="fixed inset-0 bg-gray-500 opacity-75"></div>
		<div class="bg-white rounded-lg shadow-lg overflow-hidden w-5/6 md:w-1/2 lg:w-1/3">
			<div class="bg-gray-100 p-3">
				<h2 class="text-lg font-bold">Titre du Modal</h2>
			</div>

			
			<div class="flex flex-row">
				<div class="w-1/2 p-4">
					<h3 class="font-bold text-gray-700">Template</h3>
					<p class="text-gray-600">Official</p>
					<p class="text-gray-600">Communautary</p>
					<p class="text-gray-600">My Template</p>
				</div>
				<div class="w-1/2 p-4">
					<h3 class="font-bold text-gray-700">List Of template</h3>
					<p class="text-gray-600">Blabla</p>
					<p class="text-gray-600">Blabla</p>
					<p class="text-gray-600">Blabla</p>
				</div>
			</div>

			<div class="bg-gray-100 p-3 flex justify-end">
				<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue" @click="closeModal">Fermer</button>
			</div>
		</div>
	</div>
	</div>
</template>

<script lang="ts" setup>
const closeModal = () => {
	throw new Error("not implemented")
}
</script>
