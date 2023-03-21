<script>
import axios from 'axios';
export default {
	name: 'StudentCell',
	props: {
		studentName: String,
		studentEmail: String,
		studentPresenceStatus: String,
	},
};
</script>

<template>
	<div>
		{{ studentName }}
	</div>
	<div>
		{{ studentEmail }}
	</div>
	<div>
		{{ studentPresenceStatus }}
	</div>
</template>
