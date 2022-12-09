import { Controller, Get, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { AgileAnalysisService } from 'src/base/agileAnalysis/agileAnalysis.service';

@Controller('agileanalysis')
@UseFilters(ServiceErrorCatcher)
export class AgileAnalysisController {
	constructor(private readonly agileAnalysisService: AgileAnalysisService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}
