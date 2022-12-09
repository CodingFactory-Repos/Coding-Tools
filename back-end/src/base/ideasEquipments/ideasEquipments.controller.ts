import { Controller, Get, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { IdeasEquipmentsService } from 'src/base/ideasEquipments/ideasEquipments.service';

@Controller('ideasequipments')
@UseFilters(ServiceErrorCatcher)
export class IdeasEquipmentsController {
	constructor(private readonly ideasEquipmentsService: IdeasEquipmentsService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}
