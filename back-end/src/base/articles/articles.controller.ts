import { Controller, Get, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { ArticlesService } from 'src/base/articles/articles.service';

@Controller('articles')
@UseFilters(ServiceErrorCatcher)
export class ArticlesController {
	constructor(private readonly articlesService: ArticlesService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}
