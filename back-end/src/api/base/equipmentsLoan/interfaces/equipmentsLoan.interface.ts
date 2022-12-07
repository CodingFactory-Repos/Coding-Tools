import { ObjectId } from 'mongodb';
import { Material } from '../../materials/interfaces/materials.interface';
import { User } from '../../users/interfaces/users.interface';

export interface EquipmnentLoan {
	_id?: ObjectId;
	material: Material;
	loanStartDate: Date;
	loanEndDate: Date;
	user: User;
	reason: string;
	validated: boolean;
}
