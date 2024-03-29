export interface MaterialStore {
	materials: Array<Material>;
	input: string;

	getMaterials?: (this: MaterialStore) => Promise<boolean> | Promise<undefined>;
	addMaterial?: (this: MaterialStore, material: Material) => Promise<boolean> | Promise<undefined>;
	updateMaterial?: (
		this: MaterialStore,
		material: Material,
		id: string,
	) => Promise<boolean> | Promise<undefined>;
	deleteMaterial?: (id: string) => Promise<boolean> | Promise<undefined>;
}

export interface BorrowingMaterial {
	borrowingID: string;
	borrowingDate: Date;
	borrowingUser: string;
	description: string;
	returnDate: Date;
	status: string;
	returnedTo: string;
	dateReturned: Date;
}

export interface Material {
	_id: string;
	name: string;
	type: string;
	price: number;
	acquisitionDate?: Date | string;
	picture: string;
	state: string;
	siteLocation: string;
	storageCupboard: string;
	description: string;
	borrowingHistory: Array<BorrowingMaterial>;
	status?: boolean;
}
