<template>
	<div>
		<button
			class="text-sm !text-opacity-60 text-dark-primary dark:text-light-primary flex w-full items-center justify-center pt-2.5"
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
			<p class="ml-2">Télécharcher toutes les suggestions</p>
		</button>
	</div>
</template>

<script>
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import CodingToolsLogo from '@/assets/images/CodingToolsLogo.png';
import { useUserStore } from '@/store/modules/user.store';
import { computed } from 'vue';

import { useAuthStore } from '@/store/modules/auth.store';

const authStore = useAuthStore();
const userStore = useUserStore();

const user = computed(() => authStore.user);
const userId = computed(() => user.value._id);

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
	props: ['items'],

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
						text: `Récapitulatif des propositions de matériel`,
						margin: [0, 0, 0, 20],
					},
					{
						text: `Date de création du récapitulatif : ${date}`,
					},
					{
						text: `Récapitulatif créer par : ${user.value.profile.firstName} ${user.value.profile.lastName}`,
					},
					{
						style: 'tableBody',
						widths: 'auto',
						margin: [0, 10, 0, 0],
						table: {
							widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto'],
							body: [
								[
									{ style: 'tableHeader', text: 'Nom' },
									{ style: 'tableHeader', text: 'Proposé par' },
									{ style: 'tableHeader', text: 'Description' },
									{ style: 'tableHeader', text: 'Lien' },
									{ style: 'tableHeader', text: 'Motivations' },
									{ style: 'tableHeader', text: 'Prix' },
								],
								...this.items.map(({ desc, link, motiv, price, title, user }) => {
									const [data] = user;
									console.log([title, data.profile.firstName, desc, link, motiv, `${price} €`]);
									return [title, data.profile.firstName, desc, link, motiv, `${price} €`];
								}),
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
			console.log(docDefinition);
			pdfMake.createPdf(docDefinition).download(`Suggestions_equipement`);
		},
	},
};
</script>
