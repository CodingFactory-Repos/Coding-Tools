import { Response } from 'express';
import { Response as Res, Controller, Get } from '@decorators/express';
import { EquipmentsLoanRepository } from './equipmentsLoan.repository';

@Controller('/equipmentsLoan')
export class EquipmentsLoanController {
	@Get('')
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}
