export interface OpenHouseStore {
	items: OpenHouse[];
	oneItems: OpenHouse;
}

export interface OpenHouse {
	_id?: string;
	title: string;
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
}
