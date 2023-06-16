import { ObjectId } from 'mongodb';

export interface Project {
	_id: ObjectId;
	title: string;
	description?: string;
	group?: Array<ObjectId>;
	course?: ObjectId;
	creator?: ObjectId;
}
