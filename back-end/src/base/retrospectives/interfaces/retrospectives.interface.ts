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
	isRetroEnded?: boolean;
	isLocked?: boolean;
	isTimerRunning?: boolean;
	timerInterval?: NodeJS.Timer;
	timePassed?: number;
}

export interface Postit {
	id?: string;
	user?: string; // to see
	value?: string;
	type?: number;
}
