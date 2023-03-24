import { ObjectId } from 'mongodb';
import { User } from 'src/base/users/interfaces/users.interface';

export interface Retrospective {
	_id?: ObjectId;
	title: string;
	creator: string;
	createdAt: Date;
	participants?: Array<User>;
	postits?: Array<Postit>;
	endedAt?: Date;
	slug: string;
	optionTemplate: number;
}

export interface Postit {
	example: string;
	// À définir;
}
