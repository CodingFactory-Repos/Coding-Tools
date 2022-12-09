import { Controller, Get, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { MaterialsService } from 'src/base/materials/materials.service';

@Controller('materials')
@UseFilters(ServiceErrorCatcher)
export class MaterialsController {
	constructor(private readonly materialsService: MaterialsService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}
