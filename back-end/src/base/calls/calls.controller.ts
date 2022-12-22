import { Controller, Get, Post, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { CallsService } from 'src/base/calls/calls.service';

@Controller('calls')
@UseFilters(ServiceErrorCatcher)
export class CallsController {
	constructor(private readonly callsService: CallsService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}

	@Get('/qrgenerator')
	test(@Res() res: Response) {
		return res.status(201).json({ status: 'ok', link: this.callsService.generateQrLink() });
	}

	@Post('/presence?qr=:qr')
	presence(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}
