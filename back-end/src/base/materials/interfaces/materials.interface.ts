import { ObjectId } from 'mongodb';
import { EquipmentsLoan } from 'src/base/equipmentsLoan/interfaces/equipmentsLoan.interface';

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
	borrowingHistory: Array<EquipmentsLoan>;
	status: boolean;
}
