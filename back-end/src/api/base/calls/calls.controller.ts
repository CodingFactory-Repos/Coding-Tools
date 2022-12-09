import { Response } from 'express';
import { Response as Res, Controller, Get } from '@decorators/express';
import CallsService from './calls.service';

@Controller('/calls')
export class CallsController {
	@Get('')
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}

	@Get('/qrgenerator')
	test(@Res() res: Response) {
		const service = new CallsService();
		return res.status(201).json({ status: 'ok', qr: service.generateQrCode() });
	}
}
