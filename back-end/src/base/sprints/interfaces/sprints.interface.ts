import { ObjectId } from 'mongodb';
import { AcademicYear, User } from 'src/base/users/interfaces/users.interface';

export interface Sprint {
	_id?: ObjectId;
	title: string;
	productOwner: User;
	academicYear: AcademicYear;
	beginning: Date;
	end: Date;
}
