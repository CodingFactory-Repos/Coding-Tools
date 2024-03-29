import {
	IsArray,
	IsBoolean,
	IsISO8601,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Length,
	Max,
	Min,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export class DTOCreateMaterials {
	@IsNotEmpty()
	@IsString()
	@Length(2, 255)
	public name: string;

	@IsNotEmpty()
	@IsString()
	@Length(2, 32)
	public type: string;

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	@Max(2000)
	public price: number;

	@IsISO8601()
	public acquisitionDate: Date;

	@IsNotEmpty()
	@IsString()
	@Length(5, 500000)
	public picture: string;

	@IsNotEmpty()
	@IsString()
	@Length(1, 125)
	public state: string;

	@IsNotEmpty()
	@IsString()
	@Length(5, 125)
	public siteLocation: string;

	@IsNotEmpty()
	@IsString()
	@Length(0, 125)
	public storageCupboard: string;

	@IsNotEmpty()
	@IsString()
	@Length(5, 125)
	public description: string;

	@IsNotEmpty()
	@IsBoolean()
	public status: boolean;
}

export class DTOMaetrials {
	@IsNotEmpty()
	@IsString()
	@Length(5, 255)
	public name: string;

	@IsNotEmpty()
	@IsString()
	@Length(2, 32)
	public type: string;

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	@Max(2000)
	public price: number;

	@IsISO8601()
	public acquisitionDate: Date;

	@IsNotEmpty()
	@IsString()
	@Length(5, 500)
	public picture: string;

	@IsNotEmpty()
	@IsString()
	@Length(1, 125)
	public state: string;

	@IsNotEmpty()
	@IsString()
	@Length(5, 125)
	public siteLocation: string;

	@IsNotEmpty()
	@IsString()
	@Length(1, 125)
	public storageCupboard: string;

	@IsNotEmpty()
	@IsString()
	@Length(5, 125)
	public description: string;

	@IsOptional()
	@IsArray()
	public borrowingHistory?: Array<DTOBorrowingMaterial>;

	@IsNotEmpty()
	@IsBoolean()
	public status: boolean;
}

export class DTOBorrowingMaterial {
	@IsOptional()
	public borrowingID: ObjectId;

	@IsOptional()
	@IsISO8601()
	public borrowingDate: Date;

	@IsOptional()
	@IsString()
	@Length(5, 125)
	public borrowingUser: string;

	@IsOptional()
	@IsString()
	@Length(5, 500)
	public description: string;

	@IsOptional()
	@IsISO8601()
	public returnDate: Date;

	@IsOptional()
	@IsString()
	@Length(3, 125)
	public status: string;

	@IsOptional()
	public returnedTo: ObjectId;

	@IsOptional()
	public dateReturned: Date;
}
