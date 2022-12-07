import { ObjectId } from 'mongodb';

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

export interface Group {
	// to be changed;
}
