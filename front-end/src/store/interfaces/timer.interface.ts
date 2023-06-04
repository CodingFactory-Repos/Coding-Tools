export interface TimerStore {
	timePassed?: number;
	isTimerRunning?: boolean;
	timerInterval?: NodeJS.Timer;

	dateSearchFilter?: (this: TimerStore, value: number) => void;
}
