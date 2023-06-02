import { Body, Controller, Get, Param, Post, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { RetrospectivesService } from 'src/base/retrospectives/retrospectives.service';
import { generateCodeToken } from '@/common/helpers/string.helper';
import { Postit, Retrospective } from './interfaces/retrospectives.interface';

@Controller('retrospectives')
@UseFilters(ServiceErrorCatcher)
export class RetrospectivesController {
	constructor(private readonly retrospectivesService: RetrospectivesService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}

	// TODO: DTO
	@Post('/newRetro')
	async newRetro(@Res() res: Response, @Body() body: Body) {
		const retro = body as unknown as Retrospective;
		const retrospective = await this.retrospectivesService.newRetrospective(retro);
		return res.status(201).json({ slug: retrospective.slug });
	}

	@Get('/:slug')
	async getCurrentRetro(@Res() res: Response, @Param('slug') slug: string) {
		const currentRetro = await this.retrospectivesService.getCurrentRetro(slug);
		return res.status(201).json({ currentRetro: currentRetro });
	}

	@Post('/newPostit')
	newPostit(@Res() res: Response, @Body() body: Body) {
		// TODO: AFTER
		const postit = body as Postit;
		const randomId = generateCodeToken();
		postit.id = randomId;
		return res.status(201).json({ newPostit: postit });
	}
}
