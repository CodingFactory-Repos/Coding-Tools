<template>
	<button
		@click="showModal = true"
		class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
	>
		Create a materials
	</button>
	<button @click="createPDF">Create PDF</button>
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
						v-model="site"
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

<script>
import axios from 'axios';
import html2pdf from 'html2pdf.js';

export default {
	data() {
		return {
			materials: [],
			showModal: false,
			name: '',
			type: '',
			price: '',
			picture: '',
			state: '',
			site: '',
			storageCupboard: '',
			description: '',
		};
	},
	methods: {
		addMaterial() {
			axios
				.post('http://localhost:8000/materials/create', {
					name: this.name,
					type: this.type,
					price: this.price,
					acquisitionDate: Date.now(),
					picture: this.picture,
					state: this.state,
					siteLocation: this.site,
					storageCupboard: this.storageCupboard,
					description: this.description,
					borrowingHistory: [],
					status: true,
				})
				.then((response) => {
					console.log(response);
					//Close the modal
					this.showModal = false;
				})
				.catch((error) => {
					console.log(error);
				});
		},
		// deleteMaterial() {
		// 	axios
		// 		.delete('http://localhost:8000/materials/delete/' + this.id)
		// 		.then((response) => {
		// 			console.log(response);
		// 		})
		// 		.catch((error) => {
		// 			console.log(id);
		// 			console.log(error);
		// 		});
		// },
		createPDF() {
			axios.get('http://localhost:8000/materials').then((response) => {
				console.log(response);
				const data = response.data;
				//Convertir acquisitonDate en date
				data.forEach((material) => {
					material.acquisitionDate = new Date(material.acquisitionDate).toLocaleDateString();
				});
				const html = this.generateHtml(data);
				const options = {
					filename: 'materials.pdf',
				};
				html2pdf().from(html).set(options).save();
			});
		},
		generateHtml(data2) {
			let html = `
			<html>
				<head>
					<style>
						@page {
							size: A4;
							margin: 0;
						}
						* {
							box-sizing: border-box;
							-moz-box-sizing: border-box;
						}
						body {
							font-family: sans-serif;
							margin: 0;
							padding: 0;
							width: 100%;
							height: 100%;
						}
						table {
							border-collapse: collapse;
							width: 100%;
						}
						th,
						td {
							text-align: left;
							padding: 8px;
						}
						tr:nth-child(even) {
							background-color: #f2f2f2;
						}
						th {
							background-color: #4caf50;
							color: white;
						}
						@media print {
							@page {
								size: A4;
								margin: 0;
							}
							body {
								width: 210mm;
								height: 297mm;
							}
						}
						h1 {
							color: black;
							text-align: center;
							padding-bottom: 30px;
						}
					</style>
				</head>
				<body>
					<h1>Materials</h1>
					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th>Type</th>
								<th>Price</th>
								<th>Acquisition Date</th>
								<th>State</th>
								<th>Site Location</th>
								<th>Storage Cupboard</th>
								<th>Description</th>
								<th>Borrowing History</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
			`;
			data2.forEach((material) => {
				html += `
					<tr>
						<td>${material.name}</td>
						<td>${material.type}</td>
						<td>${material.price}</td>
						<td>${material.acquisitionDate}</td>
						<td>${material.state}</td>
						<td>${material.siteLocation}</td>
						<td>${material.storageCupboard}</td>
						<td>${material.description}</td>
						<td>${material.borrowingHistory}</td>
						<td>${material.status}</td>
					</tr>
				`;
			});
			html += `
						</tbody>
					</table>
				</body>
			</html>
			`;
			return html;
		},
	},
};
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
