import { Controller, Get, Res, UseFilters, Post, Req, Put } from '@nestjs/common';
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
	async addArticle(@Req() req: Request, @Res() res: Response) {
		const article = await this.articlesService.addArticle(req.body);
		return res.status(201).json({ article, id: article.insertedId });
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
		this.articlesService.addParticipant(req.params.id, req.body).then((article) => {
			return res.status(201).json(article);
		});
	}

	// remove participant from the array of participants in article in the database
	@Put('/removeParticipant/:id')
	removeParticipant(@Req() req: Request, @Res() res: Response) {
		this.articlesService.removeParticipant(req.params.id, req.body).then((article) => {
			return res.status(201).json(article);
		});
	}

	// add like to the array of likes in article in the database
	@Put('/like/:id')
	addLike(@Req() req: Request, @Res() res: Response) {
		this.articlesService.addLike(req.params.id, req.body).then((article) => {
			return res.status(201).json(article);
		});
	}

	// remove like from the array of likes in article in the database
	@Put('/removeLike/:id')
	removeLike(@Req() req: Request, @Res() res: Response) {
		this.articlesService.removeLike(req.params.id, req.body).then((article) => {
			return res.status(201).json(article);
		});
	}

	// add dislike to the array of dislikes in article in the database
	@Put('/dislike/:id')
	addDislike(@Req() req: Request, @Res() res: Response) {
		this.articlesService.addDislike(req.params.id, req.body).then((article) => {
			return res.status(201).json(article);
		});
	}

	// remove dislike from the array of dislikes in article in the database
	@Put('/removeDislike/:id')
	removeDislike(@Req() req: Request, @Res() res: Response) {
		this.articlesService.removeDislike(req.params.id, req.body).then((article) => {
			return res.status(201).json(article);
		});
	}

	// add comment
	@Put('/comment/:id')
	addComment(@Req() req: Request, @Res() res: Response) {
		this.articlesService.addComment(req.params.id, req.body).then((article) => {
			return res.status(201).json(article);
		});
	}
}
