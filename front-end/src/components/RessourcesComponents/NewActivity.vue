<!-- eslint-disable vue/prop-name-casing -->
<!-- eslint-disable vue/require-v-for-key -->
<template>
	<div id="newActivity">
		<button
			type="button"
			@click="showNewActivity"
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
		>
			Nouvelle activitée
		</button>
		<div v-show="showActivity">
			<input type="time" v-model="startTime" />
			<input type="time" v-model="endTime" /><br />
			<textarea cols="30" rows="3" v-model="activityDesc"></textarea>
			<button
				type="button"
				@click="
					addActivity();
					showNewActivity();
				"
			>
				Add
			</button>
		</div>
		<p v-for="activity in Activities">{{ activity.time }}: {{ activity.activity }}</p>
	</div>
</template>

<script lang="ts">
export default {
	data() {
		return {
			showActivity: false,
			startTime: '',
			endTime: '',
			Activity: {
				time: '',
				activity: '',
			},
			activityDesc: '',
			// Activities : [],
		};
	},
	props: {
		Activities: {
			type: Array<{ time: string; activity: string }>,
			required: true,
		},
	},
	methods: {
		showNewActivity() {
			this.showActivity = !this.showActivity;
		},

		addActivity() {
			let duration = this.startTime + '-' + this.endTime;
			this.Activity = {
				time: duration,
				activity: this.activityDesc,
			};
			// eslint-disable-next-line vue/no-mutating-props
			this.Activities.push(this.Activity);
			this.startTime = '';
			this.endTime = '';
			this.activityDesc = '';
			//console.log(this.Activities);
		},
	},
};
</script>
