import { ObjectId } from 'mongodb';
import { Board } from '@/base/boards/interfaces/boards.interface';
import { Course } from '@/base/courses/interfaces/courses.interface';
import { User } from '@/base/users/interfaces/users.interface';

export interface Story {
	_id: ObjectId;
	board?: Board;
	course?: Course;
	title: string;
	description?: string;
	attributedTo?: User;
	column: string;
	value?: number;
	as?: string;
	Iwant?: string;
	soThat?: string;
	acceptanceCriteria?: string;	
}
