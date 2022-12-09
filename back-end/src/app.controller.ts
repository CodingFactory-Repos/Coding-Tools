import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(@Res() res: Response) {
		const msg = this.appService.getHello();
		return res.status(201).json({ status: 'ok', message: msg });
	}
}
