import { Course } from './cours.interface';


export interface RetrospectiveStore {
	privatePostit: Array<Postit>;
	tempMovingPostit: Postit;
	currentRetro: Retrospective
	userCursors: Array<UserCursor>
	retrosByUser: Array<Retrospective>
	isSideBar: boolean
	inputSearch: string
	dateSearch?: number
	isRetroFinished?: boolean
	isPostitVisible?: boolean
	isLoading?: boolean

	createNewRetro?: (this: RetrospectiveStore, retro: Retrospective) => Promise<Retrospective>;
	getCurrentRetro?: (this: RetrospectiveStore, slug: string) => Promise<void>;
	createPrivatePostit?: (this: RetrospectiveStore, privatePostit: Postit) => Promise<boolean>;
	addPostitToBoard?: (this: RetrospectiveStore, type: number, postit: Postit) => void;
	setPostitToPriv?: (this: RetrospectiveStore, postit: Postit) => void;
	removePrivatePostit?: (this: RetrospectiveStore, postit: Postit) => void;
	updatePrivatePostit?: (this: RetrospectiveStore, postit: Postit) => void;
	removeRetroPostit?: (this: RetrospectiveStore, postit: Postit) => void;
	updateRetroPostit?: (this: RetrospectiveStore, postit: Postit) => void;
	removeFromSocket?: (this: RetrospectiveStore, postit: Postit) => void;
	updateFromSocket?: (this: RetrospectiveStore, postit: Postit) => void;
	updateUserCursor?: (this: RetrospectiveStore, userCursor: UserCursor) => void;
	removeCursor?: (this: RetrospectiveStore, user: UserDisconnect) => void;
	getRetrosByUser?: (this: RetrospectiveStore) => Promise<void>;
	participantJoin?: (this: RetrospectiveStore, email: string) => Promise<void>;
	participantLeave?: (this: RetrospectiveStore, user: UserDisconnect) => Promise<void>;
	tryToggleSideBar?: (this: RetrospectiveStore) => void;
	tryCloseSideBar?: (this: RetrospectiveStore) => void;
	inputSearchFilter?: (this: RetrospectiveStore, value: string) => void;
	dateSearchFilter?: (this: RetrospectiveStore, value: number) => void;
}

export interface Retrospective {
	_id?: string;
	slug?: string;
	title?: string;
	optionTemplate?: number;
	participants?: Array<string>;
	postits?: Postits;
	createdAt?: Date;
	endedAt?: Date | null;
	creator?: string;
	isRetroEnded?: boolean;
	isLocked?: boolean;
	isTimerRunning?: boolean;
	timerInterval?: NodeJS.Timer;
	timePassed?: number;
	allowedPeers?: Array<string>;
	associatedCourse?: Course;
}

export interface Postits {
	1?: Array<Postit>;
	2?: Array<Postit>;
	3?: Array<Postit>;
}
export interface Postit {
	id?: string;
	user?: string; // to see
	value?: string;
	type?: number;
	visible?: boolean;
	sylable?: string;
}

export interface UserDisconnect {
	email?: string;
	id: string;
}

export interface UserCursor {
	position: Positions;
	clientId: string;
}

export interface Positions {
	x: number;
	y: number;
}
