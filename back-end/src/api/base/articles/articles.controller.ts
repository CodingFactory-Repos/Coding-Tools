import { Response } from 'express';
import { Response as Res, Controller, Get } from '@decorators/express';

@Controller('/article')
export class ArticlesController {
	@Get('')
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}
