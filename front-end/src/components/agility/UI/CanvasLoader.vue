import { onMounted } from '@vue/runtime-core';
<template>
	<div class="absolute w-full h-full z-50 bg-darker-primary flex justify-center items-center" v-if="internLoading">
		<div class="breeding-rhombus-spinner">
			<div class="rhombus child-1"></div>
			<div class="rhombus child-2"></div>
			<div class="rhombus child-3"></div>
			<div class="rhombus child-4"></div>
			<div class="rhombus child-5"></div>
			<div class="rhombus child-6"></div>
			<div class="rhombus child-7"></div>
			<div class="rhombus child-8"></div>
			<div class="rhombus big"></div>
		</div>
	</div>
	<slot/>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps({
	loading: { type: Boolean, required: true },
})

const isLoading = computed(() => props.loading);
const internLoading = ref(isLoading.value);
let timeout: NodeJS.Timeout = null;

const showLoader = () => {
	console.log(isLoading.value)
	if(isLoading.value) {
		timeout = setTimeout(showLoader, 1500);
	} else {
		internLoading.value = false;
		clearTimeout(timeout);
		timeout = null;
	}
}

onMounted(() => {
	showLoader();
})
</script>

<style lang="scss" scoped>
$size: 120px;
$color: #ff1d5e;
$anim-dur: 2000ms;
$anim-dly: 100ms;

.breeding-rhombus-spinner {
	height: $size;
	width: $size;
	position: relative;
	transform: rotate(45deg);

	& .rhombus {
		height: calc($size / 7.5);
		width: calc($size / 7.5);
		animation-duration: $anim-dur;
		top: calc($size / 2.3077);
		left: calc($size / 2.3077);
		background-color: $color;
		position: absolute;
		animation-iteration-count: infinite;

		&:nth-child(2n+0) {
			margin-right: 0;
		}

		&.child {
			&-1 {
				animation-name: breeding-rhombus-spinner-animation-child-1;
				animation-delay: calc($anim-dly * 1);
			}

			&-2 {
				animation-name: breeding-rhombus-spinner-animation-child-2;
				animation-delay: calc($anim-dly * 2);
			}

			&-3 {
				animation-name: breeding-rhombus-spinner-animation-child-3;
				animation-delay: calc($anim-dly * 3);
			}

			&-4 {
				animation-name: breeding-rhombus-spinner-animation-child-4;
				animation-delay: calc($anim-dly * 4);
			}

			&-5 {
				animation-name: breeding-rhombus-spinner-animation-child-5;
				animation-delay: calc($anim-dly * 5);
			}

			&-6 {
				animation-name: breeding-rhombus-spinner-animation-child-6;
				animation-delay: calc($anim-dly * 6);
			}

			&-7 {
				animation-name: breeding-rhombus-spinner-animation-child-7;
				animation-delay: calc($anim-dly * 7);
			}

			&-8 {
				animation-name: breeding-rhombus-spinner-animation-child-8;
				animation-delay: calc($anim-dly * 8);
			}
		}

		&.big {
			height: calc($size / 3);
			width: calc($size / 3);
			animation-duration: $anim-dur;
			top: calc($size / 3);
			left: calc($size / 3);
			background-color: $color;
			animation: breeding-rhombus-spinner-animation-child-big 2s infinite;
			animation-delay: 0.5s;
		}
	}
}

@keyframes breeding-rhombus-spinner-animation-child-1 {
	50% {
		transform: translate(-325%, -325%);
	}
}

@keyframes breeding-rhombus-spinner-animation-child-2 {
	50% {
		transform: translate(0, -325%);
	}
}

@keyframes breeding-rhombus-spinner-animation-child-3 {
	50% {
		transform: translate(325%, -325%);
	}
}

@keyframes breeding-rhombus-spinner-animation-child-4 {
	50% {
		transform: translate(325%, 0);
	}
}

@keyframes breeding-rhombus-spinner-animation-child-5 {
	50% {
		transform: translate(325%, 325%);
	}
}

@keyframes breeding-rhombus-spinner-animation-child-6 {
	50% {
		transform: translate(0, 325%);
	}
}

@keyframes breeding-rhombus-spinner-animation-child-7 {
	50% {
		transform: translate(-325%, 325%);
	}
}

@keyframes breeding-rhombus-spinner-animation-child-8 {
	50% {
		transform: translate(-325%, 0);
	}
}

@keyframes breeding-rhombus-spinner-animation-child-big {
	50% {
		transform: scale(0.5);
	}
}
</style>