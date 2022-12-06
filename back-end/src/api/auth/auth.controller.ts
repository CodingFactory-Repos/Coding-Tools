import { Response } from 'express';
import { Controller, Req, Body, Post, UseBefore, Res, Get } from 'routing-controllers';

import AuthService from '@/api/auth/auth.service';
import { LoginDto } from '@/api/auth/dto/auth.dto';
import { RequestWithUser } from '@/api/auth/interfaces/auth.interface';

import { User } from '@/api/base/users/interfaces/users.interface';
import { validationMiddleware } from '@/api/common/middlewares/validation.middleware';

@Controller('/auth')
export class AuthController {
	public authService = new AuthService();

	@Post('/signup')
	@UseBefore(validationMiddleware(LoginDto, 'body'))
	async signUp(@Res() res: Response, @Body() userData: LoginDto) {
		const user: User = await this.authService.signup(userData);

		return res.status(201).json({ status: 'ok', user: user });
	}

	@Post('/login')
	@UseBefore(validationMiddleware(LoginDto, 'body'))
	async logIn(@Res() res: Response, @Body() userData: LoginDto) {
		const { payload, user } = await this.authService.login(userData);

		// Set cookie with payload
		return res.status(201).json({ status: 'ok' });
	}

	@Post('/logout')
	async logOut(@Req() req: RequestWithUser, @Res() res: Response) {
		const userData: User = req.user;
		await this.authService.logout(userData);

		// Expire current auth cookie
		return res.status(201).json({ status: 'ok' });
	}

	@Get('/test')
	async getTestRoute(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}
