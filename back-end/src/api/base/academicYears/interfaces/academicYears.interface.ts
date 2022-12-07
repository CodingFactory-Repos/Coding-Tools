import { ObjectId } from 'mongodb';
import { User } from '../../users/interfaces/users.interface';

export interface AcademicYear {
	_id?: ObjectId;
	title: string;
	siteLocation: string;
	createdAt: Date;
	students?: Array<User>;
	productOwners?: Array<User>;
}
