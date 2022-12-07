import { Response } from 'express';
import { Response as Res, Controller, Get } from '@decorators/express';

@Controller('/calls')
export class CallsController {
	@Get('')
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}
