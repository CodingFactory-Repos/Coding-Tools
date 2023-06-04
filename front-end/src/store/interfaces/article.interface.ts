export interface ArticleStore {
	items: Article[];
	oneItems: Article;
	idArticle: string;
}

export interface Article {
	_id?: string;
	owner: string;
	date: string;
	title: string;
	descriptions: string;
	picture: string;
	tags: string;
	type: string;
	participants?: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
	}[];
	likes?: {
		id: string;
	}[];
	dislikes?: {
		id: string;
	}[];
	comments?: Comments[];
}

export interface Comments {
	email: string;
	firstName: string;
	lastName: string;
	title: string;
	descriptions: string;
	date: Date;
	picture?: string;
}
