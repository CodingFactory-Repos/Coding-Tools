import { ObjectId } from 'mongodb';
import { User } from 'src/base/users/interfaces/users.interface';

export interface AgileAnalysis {
	_id?: ObjectId;
	title: string;
	user: User;
	createdAt: Date;
	project: Array<Record<string, any>>;
}
