import { ObjectId } from 'mongodb';
import { User } from 'src/base/users/interfaces/users.interface';

export interface Article {
	_id?: ObjectId;
	title: string;
	description: string;
	picture: string;
	likes: Array<User>;
	dislikes: Array<User>;
	commentaries?: Array<Commentary>;
	tags: Array<string>;
	validate: boolean;
	creator: User;
	type: number;
	participants?: Array<User>;
	eventDate?: Date;
}

export interface Commentary {
	example: string;
	// user: User;
	// commentary: string;
}
