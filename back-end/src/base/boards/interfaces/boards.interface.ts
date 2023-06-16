import { ObjectId } from 'mongodb';

export interface Board {
	_id: ObjectId;
	title: string;
	project: ObjectId;
}
