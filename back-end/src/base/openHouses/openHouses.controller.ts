import { Controller, Get,Post,Req, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { OpenHousesService } from 'src/base/openHouses/openHouses.service';

@Controller('openhouses')
@UseFilters(ServiceErrorCatcher)
export class OpenHousesController {
	constructor(private readonly openHousesService: OpenHousesService) {}

	@Get('')
	index(@Res() res: Response) {
		this.openHousesService.getAllHouses().then((openHouses) => {
			res.status(200).json(openHouses);
		});
	}
	@Post('/create')
	createOpenHouses(@Req() req, @Res() res: Response) {
		this.openHousesService.createOpenHouses(req.body).then((material) => {
			res.status(200).json(material);
		});
	}
	@Get('/users')
	getUsers(@Res() res: Response) {
		this.openHousesService.getAllUsers().then((users) => {
			res.status(200).json(users);
		});
	}
}
