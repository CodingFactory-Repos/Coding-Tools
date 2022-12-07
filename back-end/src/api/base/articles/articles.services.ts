import { ArticlesRepository } from './articles.repository';

class ArticlesService {
	public repo = new ArticlesRepository();

	// Business logic methods goes there...
}

export default ArticlesService;
