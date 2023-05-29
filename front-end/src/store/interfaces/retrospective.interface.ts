

export interface RetrospectiveStore {
	privatePostit: Array<Postit>,
	tempMovingPostit: Postit,
	currentRetro: Retrospective

	createNewRetro?: (this: RetrospectiveStore, retro: Retrospective) => Promise<Retrospective>;
	getCurrentRetro?: (this: RetrospectiveStore, slug: string) => Promise<void>;
	createPrivatePostit?: (this: RetrospectiveStore, privatePostit: Postit) => Promise<boolean>;
	addPostitToBoard?: (this: RetrospectiveStore, type: number, postit: Postit) => void;
	setPostitToPriv?: (this: RetrospectiveStore, postit: Postit) => void;
	removePrivatePostit?: (this: RetrospectiveStore, postit: Postit) => void;
	updatePrivatePostit?: (this: RetrospectiveStore, postit: Postit) => void;
}


export interface Retrospective {
	_id?: string
	slug?: string
	title?: string
	optionTemplate?: number
	participants?: Array<any>
	postits?: Postits
	createdAt?: Date
	endedAt?: Date
}

export interface Postits {
	1?: Array<Postit>
	2?: Array<Postit>
	3?: Array<Postit>
}
export interface Postit {
	id?: string
	user?: string // to see
	value?: string
	type?: number
}