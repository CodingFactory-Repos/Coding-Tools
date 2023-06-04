import { Controller, Get, Res, UseFilters, Req, Param, Post } from '@nestjs/common';
import { Response, Request } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { OpenHousesService } from 'src/base/openHouses/openHouses.service';
import { ObjectId } from 'mongodb';

@Controller('openhouses')
@UseFilters(ServiceErrorCatcher)
export class OpenHousesController {
	constructor(private readonly openHousesService: OpenHousesService) {}

	@Get('')
	async getOpenHouse(@Req() req: Request, @Res() res: Response) {
		await this.openHousesService.getAllHouses().then((openHouses) => {
			return res.status(201).json(openHouses);
		});
	}

	@Get('/:id')
	async getOpenHouseById(@Req() _req: Request, @Res() res: Response, @Param() id: string) {
		const objectId = new ObjectId(id);
		await this.openHousesService.getOpenHouseBy(objectId).then((openHouses) => {
			return res.status(201).json(openHouses);
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
