import { Response } from 'express';
import { Response as Res, Controller, Get } from '@decorators/express';

@Controller('/projects')
export class ProjectsController {
	@Get('')
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}
