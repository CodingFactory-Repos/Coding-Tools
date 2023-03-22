export interface ArticleStore {
	items: Article[];
	oneItems: Article;
}

export interface Article {
	title: string;
	descriptions: {
		type: string;
		value: string;
	}[];
	picture: string;
	tags: string;
	type: string;
}
