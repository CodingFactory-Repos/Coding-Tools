import { MaterialsRepository } from './materials.repository';

class MaterialsService {
	public repo = new MaterialsRepository();

	// Business logic methods goes there...
	async getAllMaterials() {
		return await this.repo.getAllMaterials();
	}

	async createNewMaterial(query) {
		return await this.repo.createMaterial(query);
	}
}

export default MaterialsService;
