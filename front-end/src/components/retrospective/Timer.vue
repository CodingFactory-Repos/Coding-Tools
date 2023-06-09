<template>
	<div class="w-full h-full">
		<span class="text-3xl font-bold tracking-tight text-gray-700 dark:text-white">
			{{ formattedTimeLeft }}
		</span>
	</div>
	<button
		class="p-1 text-black disabled:bg-transparent dark:disabled:bg-transparent"
		v-on="isTimerRunning ? { click: pause } : { click: startTimer }"
		:disabled="isRetroFinished"
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
		class="p-1 text-black disabled:bg-transparent dark:disabled:bg-transparent disabled:cursor-not-allowed"
		:class="isTimerRunning ? 'invisible' : 'visible'"
		@click="resetTimer"
		:disabled="isTimerRunning || isRetroFinished && authStore.user.role !== 2 ? true : false"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 21 21">
			<g fill="none" fill-rule="evenodd" stroke="#6cacbd" stroke-linecap="round" stroke-linejoin="round">
				<path d="M3.578 6.487A8 8 0 1 1 2.5 10.5"/>
				<path d="M7.5 6.5h-4v-4"/>
			</g>
		</svg>
	</button>

	<button
		class="p-1 text-black disabled:bg-transparent dark:disabled:bg-transparent disabled:cursor-not-allowed"
		:class="(authStore.user.role === 2 || authStore.user.role === 3) ? 'block' : 'hidden'"
		@click="lockRetro"
	>
		<svg v-if="!isRetroLocked" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path fill="none" stroke="#DAA520" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H8zm0 0V7c0-1.333.8-4 4-4c1.904 0 2.958.944 3.5 1.99M12 14v3"
			/>
		</svg>
		<svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<g fill="#DAA520">
				<path d="M3 13a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-6zm3-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H6z"
				/>
				<path d="M7 7a5 5 0 0 1 10 0v4a1 1 0 1 1-2 0V7a3 3 0 1 0-6 0v4a1 1 0 1 1-2 0V7zm5 7a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1z"
				/>
			</g>
		</svg>
	</button>
</template>

<script lang="ts" setup>
import { socketRetro } from '@/composables/useSocketRetro';
import { useAuthStore } from '@/store/modules/auth.store';
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { computed, watch } from 'vue';

const TIME_LIMIT = 300;

const authStore = useAuthStore();
const retroStore = useRetrospectiveStore();
const timePassed = computed(() => retroStore.currentRetro.timePassed)
const isTimerRunning =  computed(() => retroStore.currentRetro.isTimerRunning);
const isRetroFinished = computed(() => retroStore.isRetroFinished);
const isRetroLocked = computed(() => retroStore.currentRetro.isLocked);


const timeLeftComp = computed(() => TIME_LIMIT - timePassed.value);

const formattedTimeLeft = computed(() => {
	const timeLeft = timeLeftComp.value;
	const minutes = Math.floor(timeLeft / 60);
	let seconds: any;
	seconds = timeLeft % 60;

	if (seconds < 10) {
		seconds = `0${seconds}`;
	}

	return `${minutes}:${seconds}`;
})

watch(timeLeftComp, newValue => {
	if (newValue === 0) {
		retroStore.isRetroFinished = true;
		retroStore.currentRetro.isRetroEnded = true
		pause();
		socketRetro.socket.emit('end-currentRetro')
	} else {
		retroStore.isRetroFinished = false;
	}
})

const startTimer = () => {

	const playAlarm = async () => {
	// possible que l'audio soit importé de manière dynamique, afin de pouvoir le modifier ultérieurement.
    const audio = await import(`@/assets/audio/retrospectiveAudio/bell_1.wav`)
    const alarm = new Audio(audio.default)
    alarm.play()
}

	retroStore.currentRetro.isTimerRunning = true;
	socketRetro.socket.emit('start-timer')
	retroStore.currentRetro.timerInterval = setInterval(() => {
		retroStore.currentRetro.timePassed += 1
		socketRetro.socket.emit('progess-timer', timePassed.value)

		if (timeLeftComp.value === 0) {
			playAlarm();
		}

	}, 1000);

};

const pause = () => {
	retroStore.currentRetro.isTimerRunning = false;
	socketRetro.socket.emit('pause-timer');
	clearInterval(retroStore.currentRetro.timerInterval);
};

const resetTimer = () => {
	socketRetro.socket.emit('reset-timer')
	retroStore.currentRetro.timePassed = 0;
	if (authStore.user.role !== 1) {
		retroStore.currentRetro.isRetroEnded = false;
	}
}

const lockRetro = () => {
	retroStore.currentRetro.isLocked = !retroStore.currentRetro.isLocked;
	socketRetro.socket.emit("lock-retro", retroStore.currentRetro.isLocked)
}



</script>
