import { ObjectId } from 'mongodb';
import { Group } from '../../goups/interfaces/groups.interface';

export interface Board {
	_id?: ObjectId;
	title: string;
	createdAt: Date;
	group: Group;
	tasks: Array<Task>;
}

interface Task {
	// À définir;
}
