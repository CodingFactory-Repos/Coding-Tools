import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db } from 'mongodb';

import { EquipmentsLoan } from 'src/base/equipmentsLoan/interfaces/equipmentsLoan.interface';

@Injectable()
export class EquipmentsLoanRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get equipmentsLoan() {
		return this.db.collection<EquipmentsLoan>('equipmentsLoan');
	}

	async equipmentLoanMaterial(query: EquipmentsLoan) {
		return this.equipmentsLoan.insertOne(query);
	}

	async updateOneEquipmentLoan(
		query: Filter<EquipmentsLoan>,
		update: Partial<EquipmentsLoan> | UpdateFilter<EquipmentsLoan>,
	) {
		return this.equipmentsLoan.updateOne(query, update);
	}

	async findOneAndUpdateEquipmentLoan(
		query: Filter<EquipmentsLoan>,
		update: Partial<EquipmentsLoan>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.equipmentsLoan.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<EquipmentsLoan>, options: FindOneAndUpdateOptions = undefined) {
		return this.equipmentsLoan.findOne(query, options);
	}

	async equipmentLoanExist(query: Filter<EquipmentsLoan>) {
		const options = { projection: { _id: 1 } };
		return this.equipmentsLoan.findOne(query, options);
	}
}
