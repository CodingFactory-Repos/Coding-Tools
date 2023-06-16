import { Controller, Get, Res, UseFilters, Post, Req, Put, UseGuards, Delete } from '@nestjs/common';
import { Response, Request } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { StoriesService } from 'src/base/stories/stories.service';

import { JwtAuthGuard } from '@/common/guards/auth.guard';
import { ObjectId } from 'mongodb';

@Controller('stories')
@UseFilters(ServiceErrorCatcher)
@UseGuards(JwtAuthGuard)
export class StoriesController {
	constructor(private readonly storiesService: StoriesService) {}

	@Get('')
	async getStory(@Req() req: Request, @Res() res: Response) {
		const story = await this.storiesService.getStory();
		return res.status(200).json(story);
	}

	@Post('/create')
	async addStory(@Req() req: Request, @Res() res: Response) {
		req.body.course = new ObjectId(req.body.course);
		const story = await this.storiesService.createStory(req.body);
		return res.status(201).json({ story, id: story.insertedId });
	}

	@Get('/:id')
	async getStoryById(@Req() req: Request, @Res() res: Response) {
		const story = await this.storiesService.getStoryById(req.params.id);
		return res.status(200).json(story);
	}

	@Get('/course/:id')
	async getStoryByCourseId(@Req() req: Request, @Res() res: Response) {
		const story = await this.storiesService.getStoryByCourseId(req.params.id);
		return res.status(200).json(story);
	}

	@Get('/board/:id')
	async getStoryByBoardId(@Req() req: Request, @Res() res: Response) {
		const story = await this.storiesService.getStoryByBoardId(req.params.id);
		return res.status(200).json(story);
	}

	@Delete('/delete/:id')
	async deleteStoryById(@Req() req: Request, @Res() res: Response) {
		const story = await this.storiesService.deleteStoryById(req.params.id);
		return res.status(202).json(story);
	}

	@Put('/update/:id')
	async updateStory(@Req() req: Request, @Res() res: Response) {
		const update = { $set: req.body };
		const story = await this.storiesService.updateStory(req.params.id, update);
		return res.status(202).json(story);
	}	
}

