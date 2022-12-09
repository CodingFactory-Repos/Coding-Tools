import { ObjectId } from 'mongodb';
import { User } from 'src/base/users/interfaces/users.interface';

export interface AcademicYear {
	_id?: ObjectId;
	title: string;
	siteLocation: string;
	createdAt: Date;
	students?: Array<User>;
	productOwners?: Array<User>;
}
