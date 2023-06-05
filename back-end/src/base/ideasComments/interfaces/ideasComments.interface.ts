import { ObjectId } from 'mongodb';

export interface IdeaComment {
	_id?: ObjectId;
	comment: string;
	date: Date;
	userId: ObjectId;
	equipmentId: ObjectId;
}
