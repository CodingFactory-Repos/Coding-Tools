import { Response } from 'express';
import { Response as Res, Controller, Get } from '@decorators/express';

@Controller('/courses')
export class UsersController {
	@Get('')
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}
