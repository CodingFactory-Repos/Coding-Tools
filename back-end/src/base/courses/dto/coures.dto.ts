
import { User } from '@/base/users/interfaces/users.interface';
import {
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class CourseDTO {
	@IsOptional()
	@IsString()
	_id: string;

	@IsNotEmpty()
	@IsString()
	tag: string;

	@IsOptional()
	classId?: string;

	@IsOptional()
	picture?: string;

	@IsOptional()
	language?: string;

	@IsOptional()
	createdAt?: Date;

	@IsOptional()
	periodStart?: Date;

	@IsOptional()
	periodEnd?: Date;

	@IsOptional()
	presence?: Array<User>;

	@IsOptional()
	project?: Array<any>; // Don't know what it is

	@IsOptional()
	site?: string
}
