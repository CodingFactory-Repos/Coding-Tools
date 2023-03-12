import { Body, Controller, Post, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from 'src/auth/auth.service';
import {
	DTOActivationToken,
	DTOAuthEmail,
	DTOAuthSignin,
	DTOAuthSignup,
	DTOResetPassword,
	DTOResetToken,
} from 'src/auth/dto/auth.dto';
import { createAuthCookie, expireAuthCookie } from 'src/auth/utils/auth.cookie';
import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';

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
		const { user, strategy } = await this.authService.signin(body);
		res.setHeader('Set-Cookie', createAuthCookie(strategy));
		return res.status(201).json({ status: 'ok', user });
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

	@Post('reset-token-check')
	async verifyResetToken(@Res() res: Response, @Body() body: DTOResetToken) {
		await this.authService.verifyResetToken(body);
		return res.status(201).json({ status: 'ok' });
	}
}
