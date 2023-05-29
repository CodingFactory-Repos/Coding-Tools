import { Jwt } from '@/common/decorators/jwt.decorator';
import { JwtAuthGuard } from '@/common/guards/auth.guard';
import { Body, Controller, Get, Param, Patch, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ObjectId } from 'mongodb';
import { UsersService } from '@/base/users/users.service';
import { ProfileBodyDTO } from '@/base/users/dto/users.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	
	@Get("github/stats/:id")
	@UseGuards(JwtAuthGuard)
	async getGithubStat(@Param('id') id: string, @Res() res: Response) {
		const document = await this.usersService.getGithubStat(id);
		if(document === null)
			return res.status(200).send(null);

		res.setHeader('Content-Type', 'text/html');
		return res.status(200).send(document);
	}

	@Get("github/languages")
	@UseGuards(JwtAuthGuard)
	async getGithubLanguages(@Jwt() userId: ObjectId, @Res() res: Response) {
		const document = await this.usersService.getGithubLanguages(userId);
		if(document === null)
			return res.status(200).send(null);

		res.setHeader('Content-Type', 'text/html');
		return res.status(200).send(document);
	}

	@Patch("profile")
	@UseGuards(JwtAuthGuard)
	async patchUserProfile(@Jwt() userId: ObjectId, @Body() body: ProfileBodyDTO, @Res() res: Response) {
		await this.usersService.updateUserProfile(userId, body);
		return res.status(200).json({ status: "ok" });
	}

	@Get("profile/list")
	@UseGuards(JwtAuthGuard)
	async getUserProfileList(@Jwt() userId: ObjectId, @Res() res: Response) {
		const usersListInfo = await this.usersService.getUserProfileList(userId);
		return res.status(200).json({ status: "ok", users: usersListInfo })
	}

	@Get("profile/:id")
	@UseGuards(JwtAuthGuard)
	async getRelatedUserProfile(@Param('id') id: string, @Res() res: Response) {
		const { user, related } = await this.usersService.getRelatedUserProfile(id);
		return res.status(200).json({ status: "ok", user, related });
	}

	@Get('room')
	@UseGuards(JwtAuthGuard)
	async getUsersListOnRoom(@Query('id') roomId: string, @Query('user') user: string, @Res() res: Response) {
		const users = await this.usersService.getUserListOnRoom(roomId, user);
		return res.status(200).json({ status: 'ok', users });
	}
}
