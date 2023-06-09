import { DeepPartial } from '@/interfaces/advanced-types.interface';
import { User } from '@/store/interfaces/auth.interfaces';

export interface UserStore {
	temporaryProfileUser: DeepPartial<User>;
	saveActionTriggered: boolean;
	uploadWaitingList: Array<boolean>;
	relatedProfiles: Array<UserProfileList>;
	relatedUserProfile: IRelatedUserProfile;
	users: Array<User>;

	saveProfile?: (this: UserStore) => Promise<boolean | undefined>;
	uploadFinished?: (this: UserStore) => boolean;
	relatedGroupProfile?: (this: UserStore) => Promise<boolean | undefined>;
	getRelatedUserProfile?: (this: UserStore, id: string) => Promise<boolean | undefined>;
}

export interface IRelatedUserProfile {
	user?: DeepPartial<User>;
	related?: Array<UserProfileList>;
}

export interface UserProfileList {
	groupName?: string;
	picture: string;
	firstName: string;
	lastName: string;
	id: string;
}

export interface UserCanvasList extends UserProfileList {
	pending?: boolean;
}

export interface UserRetroList extends UserProfileList {
	pending?: boolean;
}
