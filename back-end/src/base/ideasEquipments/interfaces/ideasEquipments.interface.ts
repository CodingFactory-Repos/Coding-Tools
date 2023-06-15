import { ObjectId } from 'mongodb';
export interface IdeaEquipment {
	_id?: ObjectId;
	name: string;
	description: string;
	motivation: string;
	link: string;
	price: string;
	user: ObjectId;
}
