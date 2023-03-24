export interface MaterialStore {
	materials: Array<Material>;
	input: string;
}

export interface BorrowingMaterial {
	borrowingDate: Date;
	borrowingUser: string;
	description: string;
	returnDate: Date;
}

export interface Material {
	_id: string;
	name: string;
	type: string;
	price: number;
	acquisitionDate: Date;
	picture: string;
	state: string;
	siteLocation: string;
	storageCupboard: string;
	description: string;
	borrowingHistory: Array<BorrowingMaterial>;
	status: boolean;
}
