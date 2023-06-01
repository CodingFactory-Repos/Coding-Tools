import { defineStore } from 'pinia';

import { pick } from '@/utils/object.helper';
import { withErrorHandler } from '@/utils/storeHandler';
import { KeysRequired } from '@/interfaces/advanced-types.interface';
import { UserStore } from '@/store/interfaces/user.interface';
import { STATUS } from '@/store/interfaces/axios.interface';
import {
	tryGetClassProfileList,
	trySaveUserProfile,
	tryGetRelatedUserProfile,
} from '@/api/user-req';

const userStoreDefaultState = (): UserStore => ({
	temporaryProfileUser: {},
	saveActionTriggered: false,
	uploadWaitingList: [],
	relatedProfiles: [],
	relatedUserProfile: {},
});

export const useUserStore = defineStore('user', {
	state: (): UserStore => userStoreDefaultState(),
	getters: {
		uploadFinished(this: UserStore) {
			return this.uploadWaitingList.every((b) => b);
		},
	},
	actions: {
		saveProfile: withErrorHandler(async function (this: UserStore) {
			const res = await trySaveUserProfile(this.temporaryProfileUser);
			if (res.data.status !== STATUS.OK) throw new Error('The returned status was not expected');
			return true;
		}, true),
		addAwaitUpload(this: UserStore) {
			const len = this.uploadWaitingList.push(false);
			return len - 1;
		},
		relatedGroupProfile: withErrorHandler(async function (this: UserStore) {
			const res = await tryGetClassProfileList();
			if (res.data.status !== STATUS.OK) throw new Error('The returned status was not expected');

			this.relatedProfiles = res.data.users;
			return true;
		}),
		getRelatedUserProfile: withErrorHandler(async function (this: UserStore, id: string) {
			const res = await tryGetRelatedUserProfile(id);
			if (res.data.status !== STATUS.OK) throw new Error('The returned status was not expected');

			this.relatedUserProfile = res.data;
			return true;
		}),
		reset(this: UserStore, keys?: Array<KeysRequired<UserStore>>) {
			Object.assign(
				this,
				keys?.length ? pick(userStoreDefaultState(), keys) : userStoreDefaultState(), // if no keys provided, reset all
			);
		},
	},
});
