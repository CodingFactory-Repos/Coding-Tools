<template>
	<div class="bg-gray-900 text-white">
		<h1 class="text-4xl font-bold text-center py-8">Sélectionnez une Image :</h1>
		<div class="grid grid-cols-4 gap-4 p-8">
			<div
				v-for="icon in imagesList"
				:key="icon.id"
				@click="selectImage(icon)"
				class="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
			>
				<img :src="icon.url" class="w-full h-auto mx-auto" alt="article" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import livre_java from '@/images/livre_java.jpg';
import macbook from '@/images/macbook.png';
import adaptateur from '@/images/adaptateur.png';
import arduino from '@/images/arduino.png';
import projecteur from '@/images/projecteur.png';
import raspi from '@/images/raspi.png';

export default {
	data() {
		return {
			imagesList: [
				{
					id: 2,
					url: livre_java,
				},
				{
					id: 3,
					url: macbook,
				},
				{
					id: 4,
					url: adaptateur,
				},
				{
					id: 5,
					url: arduino,
				},
				{
					id: 6,
					url: projecteur,
				},
				{
					id: 7,
					url: raspi,
				},
			],
			selectedImage: null,
		};
	},
	methods: {
		selectImage(image) {
			this.selectedImage = image;
			this.$emit('selectImage', image.url);
		},
	},
};
</script>
