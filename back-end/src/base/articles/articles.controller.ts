import { Controller, Get, Res, UseFilters, Post, Req } from '@nestjs/common';
import { Response, Request } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { ArticlesService } from 'src/base/articles/articles.service';

@Controller('articles')
@UseFilters(ServiceErrorCatcher)
export class ArticlesController {
	constructor(private readonly articlesService: ArticlesService) {}

	@Get('')
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}

	@Post('/add')
	addArticle(@Req() req: Request, @Res() res: Response) {
		this.articlesService.addArticle(req.body).then((article) => {
			return res.status(201).json(article);
		});
	}
}
