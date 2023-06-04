import { Controller, Get, Res, UseFilters, Req } from '@nestjs/common';
import { Response, Request } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { OpenHousesService } from 'src/base/openHouses/openHouses.service';

@Controller('openhouses')
@UseFilters(ServiceErrorCatcher)
export class OpenHousesController {
	constructor(private readonly openHousesService: OpenHousesService) {}

	@Get('')
	getOpenHouse(@Req() req: Request, @Res() res: Response) {
		this.openHousesService.getAllHouses().then((openHouses) => {
			return res.status(201).json(openHouses);
		});
	}

	@Get('/:id')
	async getOpenHouseById(@Req() req: Request, @Res() res: Response) {
		const openHouse = await this.openHousesService.getOpenHouseById(req.params.id);
		return res.status(201).json(openHouse);
	}
}
