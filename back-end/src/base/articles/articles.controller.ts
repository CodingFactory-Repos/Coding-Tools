import { Controller, Get, Res, UseFilters, Post, Req, Put, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';

import { ServiceErrorCatcher } from '@/common/decorators/catch.decorator';
import { ArticlesService } from '@/base/articles/articles.service';
import { JwtAuthGuard } from '@/common/guards/auth.guard';

@Controller('articles')
@UseFilters(ServiceErrorCatcher)
@UseGuards(JwtAuthGuard)
export class ArticlesController {
	constructor(private readonly articlesService: ArticlesService) {}

	@Get('')
	async getArticle(@Req() req: Request, @Res() res: Response) {
		const article = await this.articlesService.getArticle()
		return res.status(201).json(article);
	}

	@Post('/add')
	async addArticle(@Req() req: Request, @Res() res: Response) {
		const article = await this.articlesService.addArticle(req.body);
		return res.status(201).json({ article, id: article.insertedId });
	}

	@Get('/:id')
	async getArticleById(@Req() req: Request, @Res() res: Response) {
		const article = await this.articlesService.getArticleById(req.params.id);
		return res.status(201).json(article);
	}

	// add participant to the array of participants in article in the database
	@Put('/participant/:id')
	async addParticipant(@Req() req: Request, @Res() res: Response) {
		const article = await this.articlesService.addParticipant(req.params.id, req.body);
		return res.status(201).json(article);
	}

	// remove participant from the array of participants in article in the database
	@Put('/removeParticipant/:id')
	async removeParticipant(@Req() req: Request, @Res() res: Response) {
		const article = await this.articlesService.removeParticipant(req.params.id, req.body);
		return res.status(201).json(article);
	}

	// add like to the array of likes in article in the database
	@Put('/like/:id')
	async addLike(@Req() req: Request, @Res() res: Response) {
		const article = await this.articlesService.addLike(req.params.id, req.body);
		return res.status(201).json(article);
	}

	// remove like from the array of likes in article in the database
	@Put('/removeLike/:id')
	async removeLike(@Req() req: Request, @Res() res: Response) {
		const article = await this.articlesService.removeLike(req.params.id, req.body);
		return res.status(201).json(article);
	}

	// add dislike to the array of dislikes in article in the database
	@Put('/dislike/:id')
	async addDislike(@Req() req: Request, @Res() res: Response) {
		const article = await this.articlesService.addDislike(req.params.id, req.body);
		return res.status(201).json(article);
	}

	// remove dislike from the array of dislikes in article in the database
	@Put('/removeDislike/:id')
	async removeDislike(@Req() req: Request, @Res() res: Response) {
		const article = await this.articlesService.removeDislike(req.params.id, req.body);
		return res.status(201).json(article);
	}

	// add comment
	@Put('/comment/:id')
	async addComment(@Req() req: Request, @Res() res: Response) {
		const article = await this.articlesService.addComment(req.params.id, req.body);
		return res.status(201).json(article);
	}
}
