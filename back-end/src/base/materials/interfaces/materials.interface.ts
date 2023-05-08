import { ObjectId } from 'mongodb';

export interface Material {
	_id?: ObjectId;
	name: string;
	type: string;
	price: number;
	acquisitionDate?: Date;
	picture: string;
	state: string;
	siteLocation: string;
	storageCupboard: string;
	description: string;
	borrowingHistory?: Array<BorrowingMaterial>;
	status: boolean;
}

export interface BorrowingMaterial {
	borrowingDate: Date;
	borrowingUser: string;
	description: string;
	returnDate: Date;
}

export interface JWTUsers {
	jwt: string;
}
