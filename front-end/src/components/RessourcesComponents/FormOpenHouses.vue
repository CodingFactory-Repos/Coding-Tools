<template>
	<div>
		<button @click="openMetaModal">add open house</button>
		<ModalOverlay v-if="showMetaModal" @close="closeMetaModal" size="lg">
			<template #body>
				<form @submit.prevent="addOpenHouses">
					<input type="text" name="title" v-model="title" placeholder="Title :" /><br />
					<input type="datetime-local" v-model="date" /><br />
					<input type="url" placeholder="picture link" v-model="picture" /><br />
					<activity :Activities="Activities"></activity>
					<div>
						<input type="text" v-model="street" placeholder="street :" /><br />
						<input type="text" v-model="zipCode" placeholder="zip code :" /><br />
						<input type="text" v-model="town" placeholder="town :" /><br />
					</div>
					<textarea placeholder="Description :" v-model="description"></textarea><br />
					<participant :participants="participants" @clear="clearParticipants"></participant>
					<input type="file" @change="onFileSelected" /><br />
					<button type="submit">Submit</button>
				</form>
			</template>
		</ModalOverlay>
	</div>
</template>

<script setup lang="ts">
import ModalOverlay from '@/components/common/Modal.vue';
import { ref } from 'vue';
import activity from './NewActivity.vue';
import participant from './NewParticipant.vue';
import { http } from '@/api/network/axios';

const showMetaModal = ref(false);

const openMetaModal = () => (showMetaModal.value = true);
const closeMetaModal = () => (showMetaModal.value = false);

let title = '';
let date = '';
let street = '';
let zipCode = '';
let town = '';
let description = '';
let picture = '';
let participants = [];
let Activities = [];

const addOpenHouses = function () {
	let adress = {
		street: street,
		zipCode: zipCode,
		city: town,
	};
	http
		.post('/openhouses/create', {
			title: title,
			date: date,
			picture: picture,
			schedule: Activities,
			adress: adress,
			description: description,
			participants: participants,
		})
		.catch((error) => {
			console.log(error);
		});
	title = '';
	date = '';
	picture = '';
	street = '';
	zipCode = '';
	town = '';
	description = '';
	Activities = [];
	participants = [];
	closeMetaModal();
};

const onFileSelected = function (event) {
	console.log(event);
};

const clearParticipants = function () {
	participants.splice(0, participants.length);
};
//	 },

//}
</script>
