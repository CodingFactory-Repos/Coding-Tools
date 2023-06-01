import { Body, Controller, Get, Param, Post, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { RetrospectivesService } from 'src/base/retrospectives/retrospectives.service';
import { generateCodeToken } from '@/common/helpers/string.helper';
import { Postit, Retrospective } from './interfaces/retrospectives.interface';
import { Jwt } from '@/common/decorators/jwt.decorator';
import { ObjectId } from 'mongodb';
import { JwtAuthGuard } from '@/common/guards/auth.guard';

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
	@UseGuards(JwtAuthGuard)
	async newRetro(
		@Jwt() userId: ObjectId,
		@Res() res: Response,
		@Body() body: Body
		) {
		const retro = body as unknown as Retrospective
		const retrospective = await this.retrospectivesService.newRetrospective(retro, userId);
		return res.status(201).json({ slug: retrospective.slug });
	}

	@Get('/allRetros')
	@UseGuards(JwtAuthGuard)
	async allRetros(@Res() res: Response, @Jwt() userId: ObjectId) {
		const retros = await this.retrospectivesService.getAllRetro(userId);

		return res.status(200).json({ retrospectives: retros });
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

	@Post('/participants')
	@UseGuards(JwtAuthGuard)
	async updateParticipants(
		@Res() res: Response,
		@Body() body: Body
		) {
		const retro = body as unknown as Retrospective
		await this.retrospectivesService.tryUpdateParticipants(retro)

		return res.status(201).json({ status: 'ok' });
	}
}
