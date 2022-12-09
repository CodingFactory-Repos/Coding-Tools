import { Controller, Get, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { EquipmentsLoanService } from 'src/base/equipmentsLoan/equipmentsLoan.service';

@Controller('equipmentsloan')
@UseFilters(ServiceErrorCatcher)
export class EquipmentsLoanController {
	constructor(private readonly equipmentsLoanService: EquipmentsLoanService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}
