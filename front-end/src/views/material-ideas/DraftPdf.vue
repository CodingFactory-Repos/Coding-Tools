<template>
	<button
		class="text-dark-highlight dark:text-light-font rounded-lg pt-7 flex justify-center items-center"
		@click="generatePdf"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			fill="currentColor"
			class="mr-2"
			viewBox="0 0 16 16"
		>
			<path
				d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
			/>
			<path
				d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"
			/>
		</svg>
		<p class="ml-2">Télécharcher un draft de devis</p>
	</button>
</template>

<script>
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
import CodingToolsLogo from '@/assets/images/CodingToolsLogo.png';
import { useUserStore } from '@/store/modules/user.store';
import { computed } from 'vue';

import { useAuthStore } from '@/store/modules/auth.store';

const authStore = useAuthStore();
const userStore = useUserStore();

const user = computed(() => authStore.user);
const userId = computed(() => user.value._id);

import { createPdf } from 'pdfmake/build/pdfmake';
import * as _ from 'pdfmake/build/vfs_fonts.js';
const fonts = globalThis.pdfMake.vfs ?? _.pdfMake.vfs;

const date = new Date().toLocaleDateString();
let base64Image = null;
fetch(CodingToolsLogo)
	.then((response) => response.blob())
	.then((blob) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			base64Image = reader.result;
		};
		reader.readAsDataURL(blob);
	})
	.catch((error) => {
		console.error("Erreur lors du chargement de l'image :", error);
	});

export default {
	props: ['item'],
	methods: {
		generatePdf() {
			const docDefinition = {
				content: [
					{
						image: base64Image,
						width: 100,
						height: 75,
						alignment: 'left',
					},
					{
						text: 'Devis',
						fontSize: 18,
						bold: true,
						margin: [0, 0, 100, 30],
						alignment: 'right',
					},
					{
						text: `Récapitulatif pour l'achat d'un ${this.item.title}`,
						margin: [0, 0, 0, 10],
					},
					{
						text: `Date de création du devis : ${date}`,
					},
					{
						text: `Devis créer par : ${user.value.profile.firstName} ${user.value.profile.lastName}`,
					},
					{
						style: 'tableBody',
						widths: 'auto',
						margin: [0, 10, 0, 0],
						table: {
							widths: ['auto', '*', 50],
							body: [
								[
									{ style: 'tableHeader', text: 'Nom' },
									{ style: 'tableHeader', text: 'Description' },
									{ style: 'tableHeader', text: 'Prix' },
								],
								[
									{ style: 'tableBody', text: this.item.title, margin: [15, 5] },
									{ style: 'tableBody', text: this.item.desc, margin: 5 },
									{ style: 'tableBody', text: `${this.item.price} €`, margin: 5 },
								],
							],
						},
					},
				],
				images: {
					CodingTools: './images/CodingToolsLogo.png',
				},
				styles: {
					tableBody: {
						fontSize: 10,
						margin: 5,
					},
					tableHeader: {
						fillColor: '#e5e7eb',
						margin: 5,
					},
				},
			};
			createPdf(docDefinition, null, null, fonts).download(`devis_${this.item.title}`);
		},
	},
};
</script>
