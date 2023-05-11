import { Jwt } from '@/common/decorators/jwt.decorator';
import { JwtAuthGuard } from '@/common/guards/auth.guard';
import { Body, Controller, Get, Patch, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ObjectId } from 'mongodb';
import { UsersService } from '@/base/users/users.service';
import { ProfileBodyDTO } from '@/base/users/dto/users.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	
	@Get("github/stats")
	@UseGuards(JwtAuthGuard)
	async getGithubStat(@Jwt() userId: ObjectId, @Res() res: Response) {
		const document = await this.usersService.getGithubStat(userId);
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
}
