import { Controller, Get, Res, UseFilters, Post, Req, Put, Delete } from '@nestjs/common';
import { Response, Request } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { ArticlesService } from 'src/base/articles/articles.service';

@Controller('articles')
@UseFilters(ServiceErrorCatcher)
export class ArticlesController {
	constructor(private readonly articlesService: ArticlesService) {}

	@Get('')
	getArticle(@Req() req: Request, @Res() res: Response) {
		this.articlesService.getArticle().then((article) => {
			return res.status(201).json(article);
		});
	}

	@Post('/add')
	addArticle(@Req() req: Request, @Res() res: Response) {
		this.articlesService.addArticle(req.body).then((article) => {
			return res.status(201).json(article);
		});
	}

	@Get('/:id')
	getArticleById(@Req() req: Request, @Res() res: Response) {
		this.articlesService.getArticleById(req.params.id).then((article) => {
			return res.status(201).json(article);
		});
	}

	// add participant to the array of participants in article in the database
	@Put('/participant/:id')
	addParticipant(@Req() req: Request, @Res() res: Response) {
		console.log('req.params', req.params);
		console.log('req.body ', req.body);
		this.articlesService.addParticipant(req.params.id, req.body).then((article) => {
			return res.status(201).json(article);
		});
	}

	// remove participant from the array of participants in article in the database
	@Put('/removeParticipant/:id')
	removeParticipant(@Req() req: Request, @Res() res: Response) {
		console.log('req.params', req.params);
		console.log('req.body ', req.body);

		this.articlesService.removeParticipant(req.params.id, req.body).then((article) => {
			return res.status(201).json(article);
		});
	}
}
