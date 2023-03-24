import { Body, Controller, Get, Post, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { RetrospectivesService } from 'src/base/retrospectives/retrospectives.service';
import { JwtAuthGuard } from '@/common/guards/auth.guard';
import { DTONewRetro } from './dto/retrospectives.dto';
import { Jwt } from '@/common/decorators/jwt.decorator';
import { ObjectId } from 'mongodb';

@Controller('retrospectives')
@UseFilters(ServiceErrorCatcher)
@UseGuards(JwtAuthGuard)
export class RetrospectivesController {
	constructor(private readonly retrospectivesService: RetrospectivesService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}

	@Post('newRetro')
	async createRetro(@Jwt() userId: ObjectId, @Res() res: Response, @Body() body: DTONewRetro) {
		const newRetro = await this.retrospectivesService.createNewRetro(body, userId);
		return res.status(201).json({ status: 'ok', newRetro: newRetro });
	}

}
