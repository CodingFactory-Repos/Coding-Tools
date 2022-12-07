import { mongodb } from '@/config/config';
import { Filter, UpdateFilter, FindOneAndUpdateOptions } from 'mongodb';
import { EquipmnentLoan } from './interfaces/equipmentsLoan.interface';

export class EquipmentsLoanRepository {
	static equipmentsLoanCollection = mongodb.collection<EquipmnentLoan>('equipmentsLoan');

	get equipmentsLoan() {
		return EquipmentsLoanRepository.equipmentsLoanCollection;
	}

	async equipmentLoanMaterial(query: EquipmnentLoan) {
		return this.equipmentsLoan.insertOne(query);
	}

	async updateOneEquipmentLoan(
		query: Filter<EquipmnentLoan>,
		update: Partial<EquipmnentLoan> | UpdateFilter<EquipmnentLoan>,
	) {
		return this.equipmentsLoan.updateOne(query, update);
	}

	async findOneAndUpdateEquipmentLoan(
		query: Filter<EquipmnentLoan>,
		update: Partial<EquipmnentLoan>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.equipmentsLoan.findOneAndUpdate(query, update, options);
	}

	async equipmentLoanExist(query: Filter<EquipmnentLoan>) {
		const options = { projection: { _id: 1 } };
		return this.equipmentsLoan.findOne(query, options);
	}
	// Mongo repo for the equipmentsLoan collection
}
