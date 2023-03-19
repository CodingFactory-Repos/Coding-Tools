import { Body, Controller, Get, Post, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ObjectId } from 'mongodb';

import { AuthService } from '@/auth/auth.service';
import {
	DTOActivationToken,
	DTOAuthEmail,
	DTOAuthSignin,
	DTOAuthSignup,
	DTOResetPassword,
} from '@/auth/dto/auth.dto';
import { createAuthCookie, expireAuthCookie } from '@/auth/utils/auth.cookie';
import { ServiceErrorCatcher } from '@/common/decorators/catch.decorator';
import { JwtAuthGuard } from '@/common/guards/auth.guard';
import { Jwt } from '@/common/decorators/jwt.decorator';

@Controller('auth')
@UseFilters(ServiceErrorCatcher)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	async signUp(@Body() body: DTOAuthSignup, @Res() res: Response) {
		await this.authService.signup(body);
		return res.status(201).json({ status: 'ok' });
	}

	@Post('signin')
	async signIn(@Body() body: DTOAuthSignin, @Res() res: Response) {
		const { strategy } = await this.authService.signin(body);
		res.setHeader('Set-Cookie', createAuthCookie(strategy));
		return res.status(201).json({ status: 'ok' });
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	async logout(@Res() res: Response) {
		res.setHeader('Set-Cookie', expireAuthCookie());
		return res.status(201).json({ status: 'ok' });
	}

	@Post('activate')
	async activateAccount(@Res() res: Response, @Body() body: DTOActivationToken) {
		await this.authService.activateAccount(body);
		return res.status(201).json({ status: 'ok' });
	}

	@Post('ask-activation-token')
	async askActivationToken(@Res() res: Response, @Body() body: DTOAuthEmail) {
		await this.authService.askActivationToken(body);
		return res.status(201).json({ status: 'ok' });
	}

	@Post('ask-reset-token')
	async askResetToken(@Res() res: Response, @Body() body: DTOAuthEmail) {
		await this.authService.askResetToken(body);
		return res.status(201).json({ status: 'ok' });
	}

	@Post('reset-password')
	async resetPassword(@Res() res: Response, @Body() body: DTOResetPassword) {
		await this.authService.resetPassword(body);
		return res.status(201).json({ status: 'ok' });
	}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	async getMe(@Jwt() userId: ObjectId, @Res() res: Response) {
		const currentUser = await this.authService.retrieveCurrentUser(userId);
		return res.status(200).json({ status: 'ok', user: currentUser });
	}

	@Post('token')
	@UseGuards(JwtAuthGuard)
	async isAuth(@Jwt() userId: ObjectId, @Res() res: Response) {
		await this.authService.checkAuth(userId);
		return res.status(200).json({ status: 'ok' });
	}
}
