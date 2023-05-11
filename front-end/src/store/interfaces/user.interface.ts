import { DeepPartial } from "@/interfaces/advanced-types.interface";
import { User } from "@/store/interfaces/auth.interfaces";


export interface UserStore {
	temporaryProfileUser: DeepPartial<User>;
	saveActionTriggered: boolean;
	uploadWaitingList: Array<boolean>;
	relatedProfile: Array<UserProfileList>;

	uploadFinished?: (this: UserStore) => boolean;
	relatedGroupProfile?: (this: UserStore) => Promise<boolean | undefined>;
}

export interface UserProfileList {
	profile: {
		picture: string;
		firstName: string;
		lastName: string;
	}
}