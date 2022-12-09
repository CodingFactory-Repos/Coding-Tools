import { ObjectId } from 'mongodb';
import { User } from 'src/base/users/interfaces/users.interface';

export interface Retrospective {
	_id?: ObjectId;
	title: string;
	creatorName: string;
	createdAt: Date;
	participants: Array<User>;
	postits: Array<Postit>;
	endedAt: Date;
}

interface Postit {
	example: string;
	// À définir;
}
