import { ObjectId } from 'mongodb';
import { User } from '../../users/interfaces/users.interface';

export interface IdeaEquipment {
	_id?: ObjectId;
	name: string;
	description: string;
	motivation: string;
	link: string;
	price: string;
	user: User;
}
