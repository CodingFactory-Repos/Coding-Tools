export interface ArticleStore {
	items: Article[];
	oneItems: Article;
}

export interface Article {
	_id?: string;
	title: string;
	descriptions: {
		type: string;
		value: string;
	}[];
	picture: string;
	tags: string;
	type: string;
	participants?: {
		firstName: string;
		lastName: string;
		email: string;
	}[];
}
