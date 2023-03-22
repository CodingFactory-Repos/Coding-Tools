<script lang="ts">
import axios from 'axios';
export default {
	name: 'StudentCell',
	props: {
		studentName: String,
		studentEmail: String,
		studentPresenceStatus: String,
	},
	data() {
		return {
			color: 'dark:text-white text-[#343a40]'
		}
	}
};
</script>

<template>
	<div :class="color">
		{{ studentName }}
	</div>
	<div :class="color">
		{{ studentEmail }}
	</div>
	<div :class="color">
		{{ studentPresenceStatus }}
	</div>
</template>
