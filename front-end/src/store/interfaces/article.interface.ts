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
	status: string;
	content?: string;
	participants?: Participants[];
	likes?: {
		id: string;
	}[];
	dislikes?: {
		id: string;
	}[];
	comments?: Comments[];
}

export interface Participants {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
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
