import { ObjectId } from 'mongodb';
import { Board } from '@/base/boards/interfaces/boards.interface';
import { User } from '@/base/users/interfaces/users.interface';

export interface Story {
	_id: ObjectId;
	board?: Board;
	course?: ObjectId;
	project?: ObjectId;
	title: string;
	description?: string;
	attributedTo?: User;
	column: string;
	value?: number;
	as?: string;
	iWant?: string;
	soThat?: string;
	acceptanceCriteria?: string;	
}
