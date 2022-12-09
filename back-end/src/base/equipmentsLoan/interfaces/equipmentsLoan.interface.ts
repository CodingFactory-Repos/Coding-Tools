import { ObjectId } from 'mongodb';
import { Material } from 'src/base/materials/interfaces/materials.interface';
import { User } from 'src/base/users/interfaces/users.interface';

export interface EquipmentsLoan {
	_id?: ObjectId;
	material: Material;
	loanStartDate: Date;
	loanEndDate: Date;
	user: User;
	reason: string;
	validated: boolean;
}
