import { Body, Controller, Get, Post, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { RetrospectivesService } from 'src/base/retrospectives/retrospectives.service';
import { generateCodeToken, generateRandomToken } from '@/common/helpers/string.helper';

@Controller('retrospectives')
@UseFilters(ServiceErrorCatcher)
export class RetrospectivesController {
	constructor(private readonly retrospectivesService: RetrospectivesService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}

	@Post('/newPostit')
	newPostit(@Res() res: Response, @Body() body: Body) {
		// TODO: AFTER
		const postit = body as any;
		const randomId = generateCodeToken()
		postit.id = randomId
		return res.status(201).json({ newPostit: postit });
	}
}
