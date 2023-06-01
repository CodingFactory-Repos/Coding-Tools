<template>
	<div class="w-full h-full">
		<span class="text-3xl font-bold tracking-tight text-gray-700 dark:text-white">
			{{ formattedTimeLeft }}
		</span>
	</div>
	<button
		class="p-1 text-black"
		v-on="isTimerRunning ? { click: pause } : { click: startTimer }"
	>
		<svg v-if="!isTimerRunning" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path fill="#07bc0c" d="m9.5 16.5l7-4.5l-7-4.5v9ZM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm0-8Z"
			/>
		</svg>
		<svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path fill="#ffb242" d="M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm1-4h2V8h-2v8z"
			/>
		</svg>
	</button>
	<button
		class="p-1 text-black"
		:class="isTimerRunning ? 'invisible' : 'visible'"
		@click="resetTimer"
		:disabled="isTimerRunning"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 21 21">
			<g fill="none" fill-rule="evenodd" stroke="#6cacbd" stroke-linecap="round" stroke-linejoin="round">
				<path d="M3.578 6.487A8 8 0 1 1 2.5 10.5"/>
				<path d="M7.5 6.5h-4v-4"/>
			</g>
		</svg>
	</button>
</template>

<script lang="ts">
import SvgTimer from '@/components/common/svg/Timer.vue';

const FULL_DASH_ARRAY = 283;


const TIME_LIMIT = 300;

export default {
	data() {
		return {
			timePassed: 0,
			timerInterval: null,
			timerState: "",
			isTimerRunning: false,
			isTimePaused: false
		};
	},
	components: {
		SvgTimer,
	},

	computed: {
		formattedTimeLeft() {
			const timeLeft = this.timeLeft;
			const minutes = Math.floor(timeLeft / 60);
			let seconds : any;
			seconds = timeLeft % 60;

			if (seconds < 10) {
				seconds  = `0${seconds}`;
			}

			return `${minutes}:${seconds}`;
		},

		timeLeft() {
			return TIME_LIMIT - this.timePassed;
		},

		timeFraction() {
			const rawTimeFraction = this.timeLeft / TIME_LIMIT;
			return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
		},
	},

	watch: {
		timeLeft(newValue) {
			if (newValue === 0) {
				this.onTimesUp();
			}
		},
	},

	methods: {

		startTimer() {
			this.isTimerRunning = true;
			this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
		},
		pause() {
			this.isTimerRunning = false;
			clearInterval(this.timerInterval);
		},
		resetTimer() {
			this.timePassed = 0;
		}
	},
};
</script>

