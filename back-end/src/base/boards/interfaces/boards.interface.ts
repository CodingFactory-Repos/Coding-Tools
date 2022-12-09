import { ObjectId } from 'mongodb';
import { Group } from 'src/base/groups/interfaces/groups.interface';

export interface Board {
	_id?: ObjectId;
	title: string;
	createdAt: Date;
	group: Group;
	tasks: Array<Task>;
}

interface Task {
	example: string;
	// À définir;
}
