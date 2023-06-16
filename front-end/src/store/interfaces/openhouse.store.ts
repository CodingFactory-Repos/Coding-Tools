export interface OpenHouseStore {
	items: OpenHouse[];
	oneItems: OpenHouse;
	idOpenHouse: string;
}

export interface OpenHouse {
	_id?: string;
	title: string;
	date: string;
	picture: string;
	schedule: {
		time: string;
		activity: string;
	}[];
	address: {
		street: string;
		zipCode: string;
		city: string;
	}[];
	group: string;
	participants: {
		name: string;
	}[];
	description: string;
	project: string;
	files: string;
}
