<template>
	<div id="newActivity">
		<button type="button" @click="showNewActivity">new activity</button>
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
			this.Activities.push(this.Activity);
			this.startTime = '';
			this.endTime = '';
			this.activityDesc = '';
		},
	},
};
</script>
