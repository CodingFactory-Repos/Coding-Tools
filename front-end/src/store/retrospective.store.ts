import {
	createRetro,
	newPostit,
	tryGetRetrosByUser,
	tryGetCurrentRetro,
	tryUpdateParticipants,
	apiTryGetAllRetro,
} from '@/api/retrospective-req';
import { defineStore } from 'pinia';
import {
	Postit,
	Postits,
	Retrospective,
	RetrospectiveStore,
	UserCursor,
	UserDisconnect,
} from './interfaces/retrospective.interface';
import { socketRetro } from '@/composables/useSocketRetro';
import { useAuthStore } from './modules/auth.store';
import Swal from 'sweetalert2';

const retrospectiveDefaultState = (): RetrospectiveStore => ({
	privatePostit: [],
	tempMovingPostit: {},
	currentRetro: {},
	userCursors: [],
	retrosByUser: [],
	isSideBar: false,
	inputSearch: '',
	dateSearch: 0,
	isRetroFinished: false,
	isPostitVisible: false,
	isLoading: true,
});
// We do not want this store to be reset.
// defineStore<string, RetroStore> : -> Very strict
export const useRetrospectiveStore = defineStore('retrospective', {
	state: (): RetrospectiveStore => retrospectiveDefaultState(),
	actions: {
		async createNewRetro(this: RetrospectiveStore, retro: Retrospective) {
			try {
				const resp = await createRetro(retro);
				if (resp.status === 201) return resp.data;
			} catch (err) {
				Swal.fire({
					icon: 'error',
					title: 'Ooooops',
					text: `${err.response.data.error}`,
				});
			}
		},
		async getCurrentRetro(slug: string) {
			const resp = await tryGetCurrentRetro(slug);
			if (resp.status === 201) {
				this.currentRetro = resp.data.currentRetro;
				setTimeout(() => {
					this.isLoading = false;
				}, 1000);
			}
		},
		async createPrivatePostit(this: RetrospectiveStore, privatePostit: Postit) {
			const resp = await newPostit(privatePostit);
			if (resp.status === 201) {
				this.privatePostit.push(resp.data.newPostit);
			}

			// TODO: See if necessary to update DB
			return true;
		},
		async addPostitToBoard(this: RetrospectiveStore, type: number, postit: Postit) {
			if (postit.type) {
				const lastIndex = this.currentRetro.postits[postit.type].findIndex(
					(el: Postit) => el.id === postit.id,
				);
				this.currentRetro.postits[postit.type].splice(lastIndex, 1);
				postit.type = type;
				this.currentRetro.postits[type].push(postit);
				socketRetro.socket.emit('add-postit', this.currentRetro);
			} else {
				// This section is for the private space of the user where he creates his postits
				const privateIndex = this.privatePostit.findIndex((el) => el.id === postit.id);
				this.privatePostit.splice(privateIndex, 1);

				postit.type = type;
				this.currentRetro.postits[type].push(postit);
				socketRetro.socket.emit('add-postit', this.currentRetro);
			}
			this.tempMovingPostit = {};
		},
		async setPostitToPriv(this: RetrospectiveStore, postit: Postit) {
			const isPostitExists = this.privatePostit.findIndex((el) => el.id === postit.id);
			if (isPostitExists === -1) {
				if (postit.type) {
					const lastIndex = this.currentRetro.postits[postit.type].findIndex(
						(el: Postit) => el.id === postit.id,
					);
					this.currentRetro.postits[postit.type].splice(lastIndex, 1);
					socketRetro.socket.emit('add-postit', this.currentRetro);
				}
				delete postit.type;
				this.privatePostit.push(postit);
				this.tempMovingPostit = {};
			}
		},
		removePrivatePostit(this: RetrospectiveStore, postit: Postit) {
			const index = this.privatePostit.findIndex((el) => el.id === postit.id);
			this.privatePostit.splice(index, 1);
		},
		updatePrivatePostit(this: RetrospectiveStore, postit: Postit) {
			const index = this.privatePostit.findIndex((el) => el.id === postit.id);
			this.privatePostit[index].value = postit.value;
		},
		async removeRetroPostit(this: RetrospectiveStore, postit: Postit) {
			const index = this.currentRetro.postits[postit.type].findIndex(
				(el: Postit) => el.id === postit.id,
			);
			this.currentRetro.postits[postit.type].splice(index, 1);
			socketRetro.socket.emit('delete-postit', postit);
		},
		async updateRetroPostit(this: RetrospectiveStore, postit: Postit) {
			const index = this.currentRetro.postits[postit.type].findIndex(
				(el: Postit) => el.id === postit.id,
			);
			this.currentRetro.postits[postit.type][index].value = postit.value;
			socketRetro.socket.emit('update-postit', postit);
		},
		async removeFromSocket(this: RetrospectiveStore, postit: Postit) {
			const index = this.currentRetro.postits[postit.type].findIndex(
				(el: Postit) => el.id === postit.id,
			);
			this.currentRetro.postits[postit.type].splice(index, 1);
		},
		async updateFromSocket(this: RetrospectiveStore, postit: Postit) {
			const index = this.currentRetro.postits[postit.type].findIndex(
				(el: Postit) => el.id === postit.id,
			);
			this.currentRetro.postits[postit.type][index].value = postit.value;
		},
		async updateUserCursor(this: RetrospectiveStore, userCursor: UserCursor) {
			const existingCursorIndex = this.userCursors.findIndex(
				(cursor) => cursor.clientId === userCursor.clientId,
			);

			if (existingCursorIndex !== -1) {
				this.userCursors.splice(existingCursorIndex, 1, userCursor);
			} else {
				this.userCursors.push(userCursor);
			}
		},
		async removeCursor(this: RetrospectiveStore, user: UserDisconnect) {
			const findCursor = this.userCursors.findIndex((cursor) => cursor.clientId === user.id);
			this.userCursors.splice(findCursor, 1);
		},
		async getRetrosByUser(this: RetrospectiveStore) {
			const resp = await tryGetRetrosByUser();
			this.retrosByUser = resp.data.retrospectives;
		},
		async getAllRetros(this: RetrospectiveStore) {
			const resp = await apiTryGetAllRetro();
			// I KNOW THI COULD BE IMPLEMENTED IN A BETTER WAY
			this.retrosByUser = resp.data.retrospectives;
		},
		async participantJoin(this: RetrospectiveStore, email: string) {
			const isUserHere = this.currentRetro.participants.findIndex((el) => el === email);
			if (isUserHere === -1) this.currentRetro.participants.push(email);
			await tryUpdateParticipants(this.currentRetro);
		},
		async participantLeave(this: RetrospectiveStore, user: UserDisconnect) {
			const findUser = this.currentRetro.participants.findIndex((el) => el === user.email);
			if (findUser !== -1) this.currentRetro.participants.splice(findUser, 1);
		},
		tryToggleSideBar(this: RetrospectiveStore) {
			this.isSideBar = !this.isSideBar;
		},
		tryCloseSideBar(this: RetrospectiveStore) {
			this.isSideBar = false;
		},
		inputSearchFilter(this: RetrospectiveStore, value: string) {
			this.inputSearch = value;
		},
		dateSearchFilter(this: RetrospectiveStore, value: number) {
			this.dateSearch = value;
		},
		endCurrentRetro(this: RetrospectiveStore, endedDate: Date) {
			this.currentRetro.endedAt = endedDate;
			this.currentRetro.isRetroEnded = true;
		},
		resetRetro(this: RetrospectiveStore) {
			this.currentRetro.endedAt = null;
			this.currentRetro.isRetroEnded = false;
		},
		lockRetro(this: RetrospectiveStore, locked: boolean) {
			this.currentRetro.isLocked = locked;
		},
		// @@@@@@@@@@ TIMER RETRO @@@@@@@@@@@@@@
		runningTimer(this: RetrospectiveStore) {
			this.currentRetro.isTimerRunning = true;
		},
		stopingTimer(this: RetrospectiveStore) {
			this.currentRetro.isTimerRunning = false;
			clearInterval(this.currentRetro.timerInterval);
		},
		progressTimer(this: RetrospectiveStore, time: number) {
			this.currentRetro.timePassed = time;
		},
		resetTimer(this: RetrospectiveStore) {
			this.currentRetro.timePassed = 0;
		},
		setVisibilityPostit(this: RetrospectiveStore) {
			const authStore = useAuthStore();
			for (const key in this.currentRetro.postits) {
				const array = this.currentRetro.postits[key];
				array.forEach((element: Postit) => {
					if (element.user === authStore.user.profile.email) {
						element.visible = !element.visible;
					}
				});
			}
			socketRetro.socket.emit('update-visibility', this.currentRetro);
		},
		setSocketVisibility(this: RetrospectiveStore, postits: Postits) {
			this.currentRetro.postits = postits;
		},
	},
});
