import { ObjectId } from 'mongodb';
import { Group } from 'src/base/groups/interfaces/groups.interface';
import { User } from 'src/base/users/interfaces/users.interface';

export interface OpenHouse {
	_id?: ObjectId;
	title: string;
	date: Date;
	schedule: Date;
	address: string;
	group: Group;
	participants: Array<User>;
	description: string;
	project: Project;
}

interface Project {
	example: string;
	// to be changed;
}
