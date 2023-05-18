<template>
	<div
		class="w-full flex bg-light-primary dark:bg-dark-secondary h-12 border-b dark:border-darker-primary gap-4 py-1 px-3 items-center justify-between h-[53px]"
	>
		<div class="grow flex h-full gap-1 items-center">
			<button
				@click="showModal = true"
				class="font-bold rounded-lg text-sm px-4 py-2 focus:outline-none gap-2 gradiant"
			>
				<span class="text-white">Create materials</span>
			</button>
			<IconButton class="h-fit" type="button" @click="createPDF">
				<SvgDownload width="22" height="22" class="!fill-gray-400" />
			</IconButton>
		</div>
	</div>
	<div v-if="showModal" class="popup">
		<div class="popup-content">
			<form @submit.prevent="addMaterial">
				<div class="form-group relative z-0 w-full mb-6">
					<label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>Name</label
					>
					<input
						type="text"
						id="name"
						v-model="name"
						name="name"
						class="form-control block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none"
						placeholder="Enter name"
						required
					/>
				</div>

				<div class="form-group">
					<label for="Type" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>Type</label
					>
					<select
						id="type"
						v-model="type"
						class="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						required
					>
						<option value="" disabled selected>Select the Type</option>
						<option value="Hardware">Hardware</option>
						<option value="Mac">Mac</option>
						<option value="Livre">Livres</option>
					</select>
				</div>

				<div class="form-group">
					<label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>Price</label
					>
					<input
						type="number"
						class="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						id="price"
						v-model="price"
						placeholder="Enter price"
						required
					/>
				</div>

				<div class="form-group">
					<label for="picture" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>Picture</label
					>
					<input
						type="url"
						class="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						id="picture"
						v-model="picture"
						placeholder="Enter picture"
						required
					/>
				</div>

				<div class="form-group">
					<label for="state" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>State</label
					>
					<select
						v-model="state"
						class="form-control form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						required
					>
						<option value="" disabled selected>Select the State</option>
						<option value="Excellent">Etat Excellent</option>
						<option value="Bon">Bon Etat</option>
						<option value="Mauvais">Mauvais Etat</option>
					</select>
				</div>

				<div class="form-group">
					<label for="site" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>Site</label
					>
					<select
						v-model="siteLocation"
						class="form-control form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						required
					>
						<option value="" disabled selected>Select the Site</option>
						<option value="Cergy">Cergy</option>
						<option value="Paris">Paris</option>
					</select>
				</div>

				<div class="form-group">
					<label
						for="storageCupboard"
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>Storage Cupboard</label
					>
					<select
						v-model="storageCupboard"
						class="form-control form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						required
					>
						<option value="" disabled selected>Select the Storage</option>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
					</select>
				</div>

				<div class="form-group">
					<label
						for="description"
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>Description</label
					>
					<input
						type="text"
						class="form-control block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none"
						id="description"
						v-model="description"
						placeholder="Enter description"
						required
					/>
				</div>
				<!-- Add a litte space between the 2 -->
				<div class="mb-5"></div>
				<button
					type="submit"
					class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
				>
					Submit
				</button>
				<button
					@click="showModal = false"
					class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
				>
					Fermer
				</button>
			</form>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useMaterialStore } from '@/store/modules/material.store';
import { Material } from '@/store/interfaces/material.interface';
import { http } from '@/api/network/axios';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import SvgDownload from '@/components/common/svg/Download.vue';
import IconButton from '@/components/common/buttons/Icon.vue';
import CodingToolsLogo from '@/images/CodingToolsLogo.png';

const materialStore = useMaterialStore();
pdfMake.vfs = pdfFonts.pdfMake.vfs;
let base64Image = null;
const showModal = ref(false);
const name = ref('');
const type = ref('');
const price = ref(0);
const picture = ref('');
const state = ref('');
const siteLocation = ref('');
const storageCupboard = ref('');
const description = ref('');

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

function addMaterial() {
	console.log('addMaterial');
	//Use the store to add the material
	materialStore.addMaterial({
		name: name.value,
		type: type.value,
		price: price.value,
		acquisitionDate: new Date(Date.now()),
		picture: picture.value,
		state: state.value,
		siteLocation: siteLocation.value,
		storageCupboard: storageCupboard.value,
		description: description.value,
		status: true,
	});
	//Close the modal
	showModal.value = false;
}
function createPDF() {
	http.get<Array<Material>>('/materials').then((response) => {
		const data = response.data;
		data.forEach((material) => {
			material.acquisitionDate = new Date(material.acquisitionDate).toLocaleDateString();
		});

		const docDefinition = {
			info: {
				title: 'Materials',
			},
			content: [
				{
					image: base64Image,
					width: 200,
					height: 150,
					alignment: 'left',
				},
				{
					text: 'Summary',
					style: 'header',
				},
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.',
				{
					text: 'Materials List',
					style: 'subheader',
					pageBreak: 'before',
				},
				{
					style: 'tableExample',
					table: {
						width: 'auto',
						body: [
							[
								'Name',
								'Type',
								'Price',
								'Acquisition Date',
								'State',
								'Site Location',
								'Storage Cupboard',
								'Description',
							],
							...data.map((material) => [
								material.name,
								material.type,
								material.price + '€',
								material.acquisitionDate,
								material.state,
								material.siteLocation,
								material.storageCupboard,
								material.description,
							]),
						],
					},
				},
			],
			images: {
				CodingTools: './images/CodingToolsLogo.png',
			},
			styles: {
				subheader: {
					fontSize: 15,
					bold: true,
				},
				header: {
					fontSize: 18,
					bold: true,
					margin: [0, 0, 0, 10],
				},
				tableExample: {
					margin: [0, 5, 0, 15],
				},
			},
		};
		pdfMake.createPdf(docDefinition).open();
	});
}
</script>

<style scoped>
.popup {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 9999;
	display: flex;
	justify-content: center;
	align-items: center;
}
.popup-content {
	background-color: white;
	padding: 20px;
	border-radius: 10px;
	width: 35%;
}
</style>
