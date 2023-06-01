import { ObjectId } from 'mongodb';

export interface Retrospective {
	_id?: ObjectId;
	slug?: string;
	title: string;
	creator?: string;
	createdAt?: Date;
	participants?: Array<string>;
	postits: Array<Postit>;
	endedAt?: Date;
}

export interface Postit {
	id?: string;
	user?: string; // to see
	value?: string;
	type?: number;
}
