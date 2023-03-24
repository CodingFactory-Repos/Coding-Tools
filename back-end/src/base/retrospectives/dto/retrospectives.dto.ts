import { User } from '@/base/users/interfaces/users.interface';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, Max, Min } from 'class-validator';
import { Postit } from '../interfaces/retrospectives.interface';


export class DTONewRetro {
	@IsNotEmpty()
	@IsString()
	@Length(8, 50)
	public title: string;

	@IsNotEmpty()
	@IsNumber()
	// @Length(1)
	public optionTemplate: number;
}
