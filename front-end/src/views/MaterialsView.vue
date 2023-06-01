<template>
	<div class="container mx-5">
		<div class="ButtonsContainer">
			<div
				v-if="userRole === Roles.PEDAGOGUE"
				class="w-full flex bg-light-primary dark:bg-dark-secondary h-12 border-b dark:border-darker-primary gap-4 py-1 px-3 items-center justify-between h-[53px]"
			>
				<div class="grow flex h-full gap-1 items-center">
					<IconButton class="h-fit" type="button" @click="createPDF">
						<SvgDownload width="22" height="22" class="!fill-gray-400" />
					</IconButton>
					<hr class="h-2/3 w-px bg-light-tertiary dark:bg-dark-highlight border-none" />

					<IconButton type="button" @click="showModal = true">
						<Add width="22" height="22" class="!fill-gray-400" />
					</IconButton>
					<IconButton type="button" @click="showGraph">
						<!-- Put the color in blue when graphComponent is true-->
						<Chart width="22" height="22" :isActive="graphComponent" />
					</IconButton>
				</div>
			</div>
			<Modal v-if="showModal" @close="showModal = false">
				<template #body>
					<ButtonsMaterials />
				</template>
			</Modal>
			<!-- <h2 class="text-2xl font-bold dark:text-dark-font">List of all materials</h2> -->
			<div class="cards mt-5" v-if="materialsComponent">
				<ListMaterials />
			</div>
			<div v-if="graphComponent">
				<ChartMaterials />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import Modal from '@/components/common/Modal.vue';
import ListMaterials from '@/components/materials/ListMaterials.vue';
import ButtonsMaterials from '@/components/materials/ButtonsMaterials.vue';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import SvgDownload from '@/components/common/svg/Download.vue';
import Add from '@/components/common/svg/Add.vue';
import Chart from '@/components/common/svg/Chart.vue';
import IconButton from '@/components/common/buttons/Icon.vue';
import CodingToolsLogo from '@/images/CodingToolsLogo.png';
import { http } from '@/api/network/axios';
import { Material } from '@/store/interfaces/material.interface';
import ChartMaterials from '@/components/materials/ChartMaterials.vue';
import { Roles } from '@/store/interfaces/auth.interfaces';
import { useAuthStore } from '@/store/modules/auth.store';

const showModal = ref(false);
const graphComponent = ref(false);
const materialsComponent = ref(true);
const authStore = useAuthStore();
const user = computed(() => authStore.user);
const userRole = computed(() => user.value?.role);

pdfMake.vfs = pdfFonts.pdfMake.vfs;
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

const showGraph = () => {
	graphComponent.value = !graphComponent.value;
	materialsComponent.value = !materialsComponent.value;
};

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
.ButtonsContainer {
	width: 100%;
	text-align: center;
	margin-top: 55px;
}
.cards {
	display: flex;
	flex-wrap: wrap;
	justify-content: left;
}
</style>
