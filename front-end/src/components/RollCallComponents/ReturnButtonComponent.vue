<template>
	<button
		class="bg-blue-500 text-white py-2 px-4 rounded mt-2 mb-4 max-w-128 absolute top-2 left-16"
		@click="goBack"
	>
		Retour en arrière
	</button>
</template>

<script setup>
const goBack = () => {
	window.history.back();
};
</script>
