import { ObjectId } from "mongodb";

export interface AllowedStudent {
	_id: ObjectId;
	firstName: string;
	lastName: string;
	group: string;
	email: string;
}