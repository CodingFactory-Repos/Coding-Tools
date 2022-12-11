import { Body, Controller, Post, Query, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from 'src/auth/auth.service';
import { DTOAuthSignin, DTOAuthSignup } from 'src/auth/dto/auth.dto';
import { createAuthCookie, expireAuthCookie } from 'src/auth/utils/auth.cookie';
import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { config } from 'src/config/config';

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
	async logIn(@Body() body: DTOAuthSignin, @Res() res: Response) {
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
	async activate(@Res() res: Response, @Query("token") token: string) {
		console.log(token)

		// TODO: Verification of the token
		return res.redirect(config.app.redirect + "/signin");
	}
}
