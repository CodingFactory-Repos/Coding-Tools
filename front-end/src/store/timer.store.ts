import { defineStore } from 'pinia';
import { TimerStore } from './interfaces/timer.interface';


const retrospectiveDefaultState = (): TimerStore => ({
	timePassed: 0,
	isTimerRunning: false,
	timerInterval: null,
});
// We do not want this store to be reset.
// defineStore<string, TimerStore> : -> Very strict
export const useTimerStore = defineStore('timer', {
	state: (): TimerStore => retrospectiveDefaultState(),
	actions: {
		startTimer(this: TimerStore) {
			this.isTimerRunning = true;
			this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
		},
		pauseTimer(this: TimerStore) {
			this.isTimerRunning = false;
			clearInterval(this.timerInterval);
		},
		resetTimer(this: TimerStore) {
			this.timePassed = 0
		}
	},
});
