import { Body, Controller, Get, Param, Post, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { RetrospectivesService } from 'src/base/retrospectives/retrospectives.service';
import { Jwt } from '@/common/decorators/jwt.decorator';
import { ObjectId } from 'mongodb';
import { JwtAuthGuard } from '@/common/guards/auth.guard';
import { PostitDTO, RetrospectiveDTO } from '@/base/retrospectives/dto/retrospectives.dto';

@Controller('retrospectives')
@UseFilters(ServiceErrorCatcher)
export class RetrospectivesController {
	constructor(private readonly retrospectivesService: RetrospectivesService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}

	@Post('/newRetro')
	@UseGuards(JwtAuthGuard)
	async newRetro(@Jwt() userId: ObjectId, @Res() res: Response, @Body() body: RetrospectiveDTO) {
		const retrospective = await this.retrospectivesService.newRetrospective(body, userId);
		return res.status(201).json({ slug: retrospective.slug });
	}

	@Get('/allRetros')
	@UseGuards(JwtAuthGuard)
	async allRetros(@Res() res: Response, @Jwt() userId: ObjectId) {
		const retros = await this.retrospectivesService.getAllRetro(userId);

		return res.status(200).json({ retrospectives: retros });
	}

	@Get('/:slug')
	@UseGuards(JwtAuthGuard)
	async getCurrentRetro(@Res() res: Response, @Param('slug') slug: string) {
		const currentRetro = await this.retrospectivesService.getCurrentRetro(slug);
		return res.status(201).json({ currentRetro: currentRetro });
	}

	@Post('/newPostit')
	@UseGuards(JwtAuthGuard)
	async newPostit(@Res() res: Response, @Body() body: PostitDTO, @Jwt() userId: ObjectId) {
		const newPostit = await this.retrospectivesService.createNewPostit(body, userId);
		return res.status(201).json({ newPostit: newPostit });
	}

	@Post('/participants')
	@UseGuards(JwtAuthGuard)
	async updateParticipants(@Res() res: Response, @Body() body: RetrospectiveDTO) {
		await this.retrospectivesService.tryUpdateParticipants(body);

		return res.status(201).json({ status: 'ok' });
	}
}
