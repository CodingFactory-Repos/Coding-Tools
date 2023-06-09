<template>
    <ScrumMainPO v-if="this.isPO == true"/>
</template>

<script lang="ts">
import ScrumMainPO from '@/components/scrum/ScrumMainPO.vue';
import { http } from '@/api/network/axios';

export default {

    name: 'OrganisationView',
    default: () => [],
	data() {
		return {
			isPO: false,
		};
	},
    components: {
        ScrumMainPO,
    },

	mounted() {
        this.isProductOwner();
	},
	methods: {
        async isProductOwner(){
			try {
				const response = await http.get(`/calls/is_product_owner/`);
				this.isPO = response.data.isProductOwner;
			} catch (error) {
				console.error(error);
				this.isPO = false;
			}
            console.log(this.isPO);
		}
	},
};
</script>