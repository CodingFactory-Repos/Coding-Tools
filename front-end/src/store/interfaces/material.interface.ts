export interface MaterialStore {
	materials: Array<Material>;
	userInfos: Array<UserInfo>;
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
	acquisitionDate: Date | string;
	picture: string;
	state: string;
	siteLocation: string;
	storageCupboard: string;
	description: string;
	borrowingHistory: Array<BorrowingMaterial>;
	//if status is not defined, put it true
	status?: boolean;
}

export interface UserInfo {
	_id: string;
	profile: Array<UserProfile>;
	isVerified: boolean;
	createdAt: Date;
	status: boolean;
	hashedPassword: string;
	resetToken: string;
}

export interface UserProfile {
	email: string;
	firstName: string;
	lastName: string;
}
