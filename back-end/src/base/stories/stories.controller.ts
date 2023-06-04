import { Controller, Get, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { StoriesService } from 'src/base/stories/stories.service';

@Controller('stories')
@UseFilters(ServiceErrorCatcher)
export class StoriesController {
	constructor(private readonly storiesService: StoriesService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}
