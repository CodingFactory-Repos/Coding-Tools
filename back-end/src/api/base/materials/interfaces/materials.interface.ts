import { ObjectId } from 'mongodb';

export interface Material {
	_id?: ObjectId;
	name: string;
	type: number;
	price: number;
	acquisitionDate: Date;
	picture: string;
	state: string;
	siteLocation: string;
	storageCupboard?: string;
	description: string;
	borrowingHistory: Array<EquipmnentsLoan>;
	status: boolean;
}

interface EquipmnentsLoan {
	// to be changed;
}
