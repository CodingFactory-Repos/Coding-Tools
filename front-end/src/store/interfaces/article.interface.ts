export interface ArticleStore {
	items: Article[];
	oneItems: Article;
	idArticle: string;
}

export interface Article {
	_id?: string;
	owner: Owner;
	date: Date;
	title: string;
	descriptions: string;
	picture: string;
	tags: string;
	type: string;
	status?: string;
	content?: string;
	participants?: Participants[];
	likes?: Likes[];
	dislikes?: Dislikes[];
	comments?: Comments[];
}

export interface Likes {
	id: string;
}

export interface Dislikes {
	id: string;
}

export interface Participants {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
}

export interface Owner {
	_id: string;
	firstName: string;
	lastName: string;
}

export interface Comments {
	_id: string;
	email: string;
	firstName: string;
	lastName: string;
	title: string;
	descriptions: string;
	date: Date;
	picture?: string;
}
