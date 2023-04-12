<template>
	 <!-- <div ref="container" style="position: relative;"> -->
		<div v-for="(user, index) in users" :key="user.id" :style="{ top: user.y + 'px', left: user.x + 'px' }" class="cursor" id="cursor"></div>
	<!-- </div> -->
</template>

<script lang="ts">
import { state } from '@/composables/socketRetro';
import { Scene } from '@/lib/pixi-tools/scene';
import { defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue';

export default defineComponent({
	props: {
		sceneId: { type: String, required: true },
		scene: { type: Scene, required: true}
	},
	setup(props) {
		console.log("props", props);


		const users = reactive({});
		// const users = ref([])
		const mouseY = ref(0);
		const mouseX = ref(0);
		const container = ref(null);

		onMounted(() => {
			const canvas = document.getElementById('canvas')
			state.socket.on('positions', (({ id, x, y }) => {
				console.log("bonjout", users);
				users[id] = { x, y };
				handlePositionUpdate()
			}));
			state.socket.emit('joinScene', props.sceneId)
			state.socket.on('userJoined', (() => {
				console.log("azneijzaioejaziojeoiazjeoazoiezaj");

			}))


			canvas.addEventListener('mousemove', handleMouseMove)
			// canvas.addEventListener("mousemove", ((event: any) => {
			// 	console.log("azeazeaz");

			// 	mouseX.value = event.offsetX;
			// 	mouseY.value = event.offsetY;
			// 	state.socket.emit('mousemove', { x: mouseX.value, y: mouseY.value });
			// }));
		// 	props.scene.ticker.add(() => {
		// 	for (const user of Object.values(users)) {
		// 		let cursor = document.getElementById(user.id);
		// 		if (!cursor) {
		// 			// Si la div pour l'utilisateur n'existe pas, la créer
		// 			cursor = document.createElement('div');
		// 			cursor.id = user.id;
		// 			cursor.classList.add('cursor');
		// 			document.body.appendChild(cursor);
		// 		}
		// 		cursor.style.top = user.y + 'px';
		// 		cursor.style.left = user.x + 'px';
		// 	}
		// });


		state.socket.on('userListUpdate', (usersData) => {
			users.value = usersData;
		});

		state.socket.on('positionUpdate', (user) => {
			console.log("hello");

			const updatedUsers = users.value.filter((u) => u.id !== user.id);
			updatedUsers.push(user);
			users.value = updatedUsers;
		});
		})

		onUnmounted(() => {
			state.socket.emit('leaveScene', props.sceneId)
		})

		// const handleMouseMove = (e: any) => {
		// 	console.log("bonjour");

		// 	// const rect = container.value.getBoundingClientRect()
		// 	mouseX.value = e.offsetX;
		// 	mouseY.value = e.offsetY;
		// 	// const x = e.clientX - rect.left
		// 	// const y = e.clientY - rect.top
		// 	state.socket.emit('mousemove', { sceneId: props.sceneId, x: mouseX.value, y: mouseY.value })
		// }

		const handlePositionUpdate = () => {
			for (const user of Object.values(users)) {
				let cursor = document.getElementById(user.id);
				if (!cursor) {
					// Si la div pour l'utilisateur n'existe pas, la créer
					cursor = document.createElement('div');
					cursor.id = user.id;
					cursor.classList.add('cursor');
					document.body.appendChild(cursor);
				}
				cursor.style.top = user.y + 'px';
				cursor.style.left = user.x + 'px';
			}
    //   if (data.sceneId === props.sceneId) {
    //     const index = users.value.findIndex((user) => user.id === data.id)
    //     if (index !== -1) {
    //       users.value[index].x = data.x
    //       users.value[index].y = data.y
    //     } else {
    //       users.value.push({ id: data.id, name: data.name, x: data.x, y: data.y })
    //     }
    //   }
    }

	// const handleLeaveScene = (data) => {
    //   if (data.sceneId === props.sceneId) {
    //     const index = users.value.findIndex((user) => user.id === data.id)
    //     if (index !== -1) {
    //       users.value.splice(index, 1)
    //     }
    //   }
    // }

    // Listen to socket events
    // state.socket.on('mousemove', handlePositionUpdate)
    // state.socket.on('leaveScene', handleLeaveScene)

	// LAST TEST

		const handleMouseMove = (event) => {
			// const container = containerRef.value;
			// const canvas = canvasRef.value;

			// if (!container || !canvas) {
			// 	return;
			// }

			// const containerRect = container.getBoundingClientRect();
			const x = event.clientX
			const y = event.clientY
			state.socket.emit('position', {sceneId: props.sceneId, x, y });
		};

		// const handleCanvasData = (data) => {
		// 	const canvas = canvasRef.value;
		// 	const context = canvas.getContext('2d');
		// 	const img = new Image();

		// 	img.onload = () => {
		// 		context.drawImage(img, 0, 0);
		// 	};

		// 	img.src = data;
		// };



		return {
			users,
			container
		}
	}

})
</script>

<style>

#cursor {
	position: absolute;
	width: 30px;
	height: 30px;
	border-radius: 50%;
	background-color: red;
	z-index: 100;
}

</style>