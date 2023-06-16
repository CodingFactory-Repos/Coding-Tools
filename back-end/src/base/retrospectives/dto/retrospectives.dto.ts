import { Type } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	Length,
	ValidateNested,
} from 'class-validator';

import { ObjectId } from 'mongodb';
import { Postit } from '../interfaces/retrospectives.interface';
import { CourseDTO } from '@/base/courses/dto/coures.dto';

export class RetrospectiveDTO {
	@IsOptional()
	_id?: ObjectId;

	@IsOptional()
	@IsString({ message: 'Invalid type format' })
	@Length(0, 6, { message: 'Your resume must be between 0 and 300 characters' })
	slug: string;

	@IsString({ message: 'Invalid type format' })
	@IsNotEmpty()
	title: string;

	@IsNotEmpty()
	@IsNumber()
	optionTemplate: number;

	@IsOptional()
	@IsString()
	@Length(8, 127)
	creator: string;

	@IsOptional()
	@IsString()
	createdAt: Date;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	participants: Array<string>;

	@IsOptional()
	@IsArray()
	allowedPeers: Array<ObjectId>;

	@IsObject()
	@Type(() => PostitsDTO)
	postits: Array<Postit>;

	@IsOptional()
	@IsString()
	endedAt: Date;

	@IsOptional()
	@IsBoolean()
	isRetroEnded: boolean;

	@IsOptional()
	@IsBoolean()
	isLocked: boolean;

	@IsOptional()
	@IsBoolean()
	isTimerRunning: boolean;

	@IsOptional()
	timerInterval: NodeJS.Timer;

	@IsOptional()
	@IsNumber()
	timePassed: number;

	@IsObject()
	@ValidateNested()
	@Type(() => CourseDTO)
	associatedCourse: CourseDTO;
}

export class PostitDTO {
	@IsOptional()
	@IsString()
	id: string;

	@IsNotEmpty()
	@IsString()
	@Length(8, 127)
	user: string;

	@IsNotEmpty()
	@IsString()
	@Length(0, 140)
	value: string;

	@IsOptional()
	@IsNumber()
	type: number;

	@IsNotEmpty()
	@IsBoolean()
	visible: boolean;

	@IsOptional()
	@IsString()
	@Length(0, 2)
	sylable: string;
}

class PostitsDTO {
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => PostitDTO)
	@IsArray()
	1: Array<PostitDTO>;

	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => PostitDTO)
	@IsArray()
	2: Array<PostitDTO>;

	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => PostitDTO)
	@IsArray()
	3: Array<PostitDTO>;
}

export class ProjectRetroInvitationVerificationDTO {
	@IsString()
	@Length(32)
	token: string;
}

export class RetroUserIdDTO {
	@IsString()
	@Length(24)
	userId: string;
}

export class RetroUserEmailDTO {
	@IsString()
	userEmail: string;
}
