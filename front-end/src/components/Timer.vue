<template>
	<div class="base-timer">
		<SvgTimer :circleDasharray="circleDasharray"/>
		<span class="base-timer__label">{{ formattedTimeLeft }}</span>
	</div>
	<button
		class="p-1"
		v-on="isTimerRunning ? { click: pause } : { click: startTimer }"
		:disabled="isTimerPaused"
	>
		{{ isTimerRunning ? 'Resume' : 'Start' }}
	</button>
	<button
		class="p-1"
		v-on="isTimerPaused ? { click: startTimer } : { click: pause }"
		:disabled="isTimerRunning"
	>
		{{ isTimerPaused ? 'Resume' : 'Pause' }}
	</button>
	<button class="p-1"
		
	>
		{{ isTimerPaused ? 'Resume' : 'Reset' }}</button>
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
		};
	},
	components: {
		SvgTimer,
	},

	computed: {
		circleDasharray() {
			return `${(this.timeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`;
		},

		formattedTimeLeft() {
			const timeLeft = this.timeLeft;
			const minutes = Math.floor(timeLeft / 60);
			let seconds = timeLeft % 60;

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

		isTimerRunning() {
			return this.timerState === 'Stopped';
		},

		isTimerPaused() {
			return this.timerState == 'Paused';
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
			this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
		},
		pause() {
			clearInterval(this.timerInterval);
		},
	},
};
</script>

<style scoped lang="scss">
.base-timer {
	position: relative;
	width: 300px;
	height: 300px;

	&__svg {
		transform: scaleX(-1);
	}

	&__circle {
		fill: none;
		stroke: none;
	}

	&__path-elapsed {
		stroke-width: 8px;
	}

	&__path-remaining {
		stroke-width: 8px;
		stroke-linecap: round;
		transform: rotate(90deg);
		transform-origin: center;
		transition: 1s linear all;
		fill-rule: nonzero;
		stroke: currentColor;
	}

	&__label {
		position: absolute;
		width: 300px;
		height: 300px;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 48px;
	}
}
</style>
