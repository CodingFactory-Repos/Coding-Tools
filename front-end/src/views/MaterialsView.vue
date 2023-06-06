<template>
	<div class="container mx-5">
		<div class="ButtonsContainer">
			<div
				v-if="userRole === Roles.PRODUCT_OWNER || userRole === Roles.PEDAGOGUE"
				class="w-full max-w-[235px] flex bg-light-primary dark:bg-dark-secondary border-b rounded-lg dark:border-darker-primary gap-4 py-1 px-3 items-center justify-between h-[53px]"
			>
				<div class="grow flex h-full gap-1 items-center">
					<IconButton type="button" @click="router.push('/app/ideas')">
						<LightBulb width="22" height="22" class="!fill-gray-400" />
					</IconButton>

					<hr class="h-2/3 w-px bg-light-tertiary dark:bg-dark-highlight border-none" />

					<div v-if="userRole === Roles.PEDAGOGUE">
						<IconButton class="h-fit" type="button" @click="createPDF">
							<SvgDownload width="22" height="22" class="!fill-gray-400" />
						</IconButton>

						<IconButton type="button" @click="showModal = true">
							<Add width="22" height="22" class="!fill-gray-400" />
						</IconButton>
						<IconButton type="button" @click="router.push('/app/materialsDashboard')">
							<Chart width="22" height="22" />
						</IconButton>
						<IconButton
							type="button"
							class="relative inline-flex items-center text-sm font-medium text-center text-white rounded-lg"
							@click="showNotificationCenter"
						>
							<Bell width="22" height="22" class="!fill-gray-400" />
							<span class="sr-only">Notifications</span>
							<div
								class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900"
							>
								{{ reservation.length }}
							</div>
						</IconButton>
					</div>
				</div>
			</div>
			<Modal v-if="showModal" @close="showModal = false">
				<template #body>
					<ButtonsMaterials @close="showModal = false" />
				</template>
			</Modal>
			<div v-if="notificationCenter">
				<ApprouvalCenter :users="users" :reservation="reservation" />
			</div>
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
import { computed, ref, onMounted } from 'vue';
import Modal from '@/components/common/Modal.vue';
import ListMaterials from '@/components/materials/ListMaterials.vue';
import ButtonsMaterials from '@/components/materials/ButtonsMaterials.vue';
import SvgDownload from '@/components/common/svg/Download.vue';
import Add from '@/components/common/svg/Add.vue';
import Chart from '@/components/common/svg/Chart.vue';
import IconButton from '@/components/common/buttons/Icon.vue';
import CodingToolsLogo from '@/images/CodingToolsLogo.png';
import LightBulb from '@/components/common/svg/LightBulb.vue';
import { http } from '@/api/network/axios';
import { Material } from '@/store/interfaces/material.interface';
import ChartMaterials from '@/components/materials/ChartMaterials.vue';
import { Roles } from '@/store/interfaces/auth.interfaces';
import { useAuthStore } from '@/store/modules/auth.store';
import Bell from '@/components/common/svg/Bell.vue';
import ApprouvalCenter from '@/components/materials/ApprouvalCenter.vue';
import { useMaterialStore } from '@/store/modules/material.store';
import { useRouter } from 'vue-router';

// This file will register globalThis.pdfMake.vfs, the documentation does not explicity define the behavior
// Unless you want to change the font, you don't need to assign pdfmake.vfs = globalThis.pdfMake.vfs.
// It will work either way with the import below, enjoy.
import 'pdfmake/build/vfs_fonts.js';
import { createPdf } from 'pdfmake/build/pdfmake';

const showModal = ref(false);
const router = useRouter();
const notificationCenter = ref(false);
const graphComponent = ref(false);
const materialsComponent = ref(true);
const authStore = useAuthStore();
const user = computed(() => authStore.user);
const userRole = computed(() => user.value?.role);
const materialStore = useMaterialStore();
const reservation = computed(() => materialStore.pendingMaterials);
const users = ref([]);
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

onMounted(() => {
	materialStore.getPendingMaterials().then(() => {
		reservation.value.forEach((res1) => {
			materialStore.getUserById(res1.borrowingHistory.borrowingUser).then((res) => {
				users.value.push(res);
			});
		});
	});
});

const showNotificationCenter = () => {
	notificationCenter.value = !notificationCenter.value;
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
		createPdf(docDefinition).open();
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
