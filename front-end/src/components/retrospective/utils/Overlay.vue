<template>
	<Transition name="fade">
		<div v-if="active" class="overlay">
			<div class="overlay-boudary" @click="closeOverlay" />
			<div :class="['overlay-content', fullSize ? 'full' : 'fit']">
				<div
					class="overlay-content-close"
					@click.stop="closeOverlay"
					:style="{
						'--col': crossColor,
					}"
				/>
				<div class="overlay-content-box">
					<slot />
				</div>
			</div>
		</div>
	</Transition>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
	props: {
		active: { type: Boolean, required: true },
		crossColor: { type: String, required: false, default: '#062A79' },
		fullSize: { type: Boolean, required: false, default: true },
	},
	emits: ['update:active'],
	setup(props, { emit }) {
		const active = ref(false);

		const closeOverlay = () => {
			document.body.style.removeProperty('overflow');
			emit('update:active', false);
		};

		watch(
			() => props.active,
			(val) => {
				active.value = val;
			},
		);

		return {
			closeOverlay,
		};
	},
});
</script>

<style lang="scss" scoped>
.overlay {
	height: 100vh;
	width: 100%;
	display: flex;
	position: fixed;
	justify-content: center;
	align-items: center;
	top: 0px;
	bottom: 0px;
	left: 0px;
	right: 0px;
	z-index: 1000;

	&-boudary {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: rgba(44, 44, 44, 0.4);
	}

	&-content {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: white;
		border-radius: 10px;
		transition: opacity 300ms ease-in-out;
		overflow: hidden;
		position: relative;
		margin: 0 30px;

		&.full {
			width: 100%;
		}
		&.fit {
			width: fit-content;
		}

		@media (min-width: 769px) {
			max-width: 850px;
		}

		@media (max-width: 768px) {
			margin: 0 15px;
		}

		&-box {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 30px;

			@media (max-width: 768px) {
				height: fit-content;
				max-height: 90vh;
				overflow: scroll;

				// & > :last-child > :last-child {
				// 	margin-bottom: 2em;

				// 	& > :last-child {
				// 		margin-bottom: 2em;
				// 	}
				// }

				display: grid;
				align-items: unset;
				justify-content: unset;
			}
		}

		&-close {
			--col: '#062A79';

			position: absolute;
			top: 0px;
			right: 0px;
			width: 50px;
			height: 50px;
			background: var(--col);
			clip-path: polygon(0% 0%, 100% 0%, 100% 100%);
			cursor: pointer;
			z-index: 2;

			&:hover {
				background: var(--col);
			}

			&::before,
			&::after {
				content: '';
				position: absolute;
				right: 14px;
				top: 4.5px;
				height: 20px;
				width: 3px;
				background-color: white;
				border-radius: 10px;
			}

			&::before {
				transform: rotate(45deg);
			}
			&::after {
				transform: rotate(-45deg);
			}
		}
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
