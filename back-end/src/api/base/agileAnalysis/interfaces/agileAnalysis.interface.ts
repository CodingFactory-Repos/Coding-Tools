import { ObjectId } from 'mongodb';
import { User } from '../../users/interfaces/users.interface';

export interface AgileAnalysis {
	_id?: ObjectId;
	title: string;
	user: User;
	createdAt: Date;
	project: Array<{}>;
}
