import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { MaterialsRepository } from 'src/base/materials/materials.repository';
import { UsersRepository } from 'src/base/users/users.repository';
import { DTOCreateMaterials } from './dto/materials.dto';
import { Material } from './interfaces/materials.interface';

@Injectable()
export class MaterialsService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => MaterialsRepository))
		private usersRepository: UsersRepository,
		private materialsRepository: MaterialsRepository,
	) {}

	async getAllMaterials() {
		return await this.materialsRepository.getAllMaterials();
	}

	async getAllMaterialsStats() {
		return await this.materialsRepository.getAllMaterialsStats();
	}

	async getAllMacs() {
		return await this.materialsRepository.getAllMacs();
	}

	async getMacsStatus(kind: string) {
		const data = await this.materialsRepository.getMacsStatus(kind);
		const status = data.map(({ status, count }) => {
			const stati = ['Emprunté', 'Disponible'];
			return { status: stati[+status], count };
		});
		return status;
	}

	async getMaterialsUsed() {
		const material = await this.materialsRepository.getMaterialsUsed();
		const top = material
			.map(({ borrowingHistory, name }) => {
				const [{ borrowingDate, returnDate }] = borrowingHistory;
				const borrowing = +new Date(borrowingDate);
				const returndate = +new Date(returnDate);
				const time = returndate - borrowing;
				const days = Math.floor(time / 864e5);
				return { name, days };
			})
			.sort((a, b) => b.days - a.days)
			.slice(0, 5);
		return top;
	}

	async createNewMaterial(payload: DTOCreateMaterials) {
		const query = payload as Material;
		return await this.materialsRepository.createMaterial(query);
	}
	async updateMaterial(query, update) {
		return await this.materialsRepository.updateOneMaterial(query, update);
	}

	async deleteMaterial(query) {
		return await this.materialsRepository.deleteOneMaterial(query);
	}

	async addReservation(query, update) {
		return await this.materialsRepository.addOneReservation(query, update);
	}
	async getMaterialById(id) {
		return await this.materialsRepository.getMaterialById(id);
	}
	async getPendingReservation() {
		return await this.materialsRepository.getPendingReservation();
	}
	async declineReservation(query, update, options) {
		return await this.materialsRepository.declineReservation(query, update, options);
	}
	async returnMaterial(query, update, options) {
		return await this.materialsRepository.returnMaterial(query, update, options);
	}
	async acceptReservation(query, update, options) {
		return await this.materialsRepository.acceptReservation(query, update, options);
	}
}
