import { Controller, Get, Res, UseFilters, Post, Req, Put, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { StoriesService } from 'src/base/stories/stories.service';

import { JwtAuthGuard } from '@/common/guards/auth.guard';

@Controller('stories')
@UseFilters(ServiceErrorCatcher)
@UseGuards(JwtAuthGuard)
export class StoriesController {
	constructor(private readonly storiesService: StoriesService) {}

	@Get('')
	async getStory(@Req() req: Request, @Res() res: Response) {
		const story = await this.storiesService.getStory();
		return res.status(201).json(story);
	}

	@Post('/add')
	async addStory(@Req() req: Request, @Res() res: Response) {
		const story = await this.storiesService.createStory(req.body);
		return res.status(201).json({ story, id: story.insertedId });
	}

	@Get('/:id')
	async getStoryById(@Req() req: Request, @Res() res: Response) {
		const story = await this.storiesService.getStoryById(req.params.id);
		return res.status(201).json(story);
	}
}

