import { Body, Controller, Get, Param, Post, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { RetrospectivesService } from 'src/base/retrospectives/retrospectives.service';
import { Jwt } from '@/common/decorators/jwt.decorator';
import { ObjectId } from 'mongodb';
import { JwtAuthGuard } from '@/common/guards/auth.guard';
import { PostitDTO, ProjectRetroInvitationVerificationDTO, RetroUserEmailDTO, RetroUserIdDTO, RetrospectiveDTO } from '@/base/retrospectives/dto/retrospectives.dto';
import { RoleValidator } from '@/common/guards/role.guard';
import { Roles } from '../users/interfaces/users.interface';

@Controller('retrospectives')
@UseFilters(ServiceErrorCatcher)
export class RetrospectivesController {
	constructor(private readonly retrospectivesService: RetrospectivesService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}

	@Post('/newRetro')
	@UseGuards(JwtAuthGuard, new RoleValidator(Roles.PRODUCT_OWNER))
	async newRetro(
		@Jwt() userId: ObjectId,
		@Res() res: Response,
		@Body() body: RetrospectiveDTO
		) {
		const retrospective = await this.retrospectivesService.newRetrospective(body, userId);
		return res.status(201).json({ slug: retrospective.slug });
	}

	@Get('/retrosByUser')
	@UseGuards(JwtAuthGuard)
	async getRetrosByUser(@Res() res: Response, @Jwt() userId: ObjectId) {
		const retros = await this.retrospectivesService.getRetrosByUser(userId);

		return res.status(200).json({ retrospectives: retros });
	}

	@Get('/allRetros')
	@UseGuards(JwtAuthGuard, new RoleValidator(Roles.PEDAGOGUE))
	async getAllRetros(@Res() res: Response) {
		const retros = await this.retrospectivesService.getAllRetro();

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

	@Post('invitation/:roomId')
	@UseGuards(JwtAuthGuard)
	async sendRetroInvitation(
		@Jwt() userId: ObjectId,
		@Body() body: RetroUserIdDTO,
		@Param('roomId') roomId: string,
		@Res() res: Response,
	) {
		await this.retrospectivesService.sendRetroInvitation(body.userId, roomId, userId);
		return res.status(201).json({ status: 'ok' });
	}

	@Post('verify-invitation')
	@UseGuards(JwtAuthGuard)
	async verifyRetroInvitation(
		@Jwt() userId: ObjectId,
		@Body() body: ProjectRetroInvitationVerificationDTO,
		@Res() res: Response,
	) {
		const roomId = await this.retrospectivesService.verifyRetroInvitation(body.token, userId);
		return res.status(201).json({ status: 'ok', roomId });
	}

	@Post('participants/:roomId/remove-access')
	@UseGuards(JwtAuthGuard)
	async removeUserAccessToRetro(
		@Jwt() userId: ObjectId,
		@Param('roomId') roomId: string,
		@Body() body: RetroUserEmailDTO,
		@Res() res: Response,
	) {
		console.log("body", body);

		await this.retrospectivesService.removeUserAccessToRetro(body.userEmail, roomId, userId);
		return res.status(201).json({ status: 'ok' });
	}
}
