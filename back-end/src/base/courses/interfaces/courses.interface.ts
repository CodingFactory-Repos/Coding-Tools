import { ObjectId } from 'mongodb';
import { User } from 'src/base/users/interfaces/users.interface';
import { Retrospective } from 'src/base/retrospectives/interfaces/retrospectives.interface';

export interface Course {
	_id?: ObjectId;
	tag: string;
	picture : string;
	language: string;
	createdAt: Date;
	productOwner: ObjectId | User;
	periodStart: Date;
	periodEnd: Date;
	call : Call;
	projects : Array<string>;
	siteLocation: string;
	student : Array<ObjectId | User>;
	retrospective?: Retrospective;
	files?: Array<string>;
	commentaries?: Array<string>;
}

export interface Call {
	example: string;
	// to be changed;
}
