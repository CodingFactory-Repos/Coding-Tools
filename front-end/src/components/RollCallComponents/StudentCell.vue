<script>
export default {
	name: 'StudentCell',
	props: {
		studentname: String,
		status: String,
	},
};
</script>
<template>
	<div>
		{{ studentname }}
	</div>
	<div>
		{{ status }}
	</div>
</template>
