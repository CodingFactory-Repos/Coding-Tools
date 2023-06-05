import { Controller, Get, Res, UseFilters, Post, Req, Delete } from '@nestjs/common';
import { Response, Request } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { IdeasEquipmentsService } from 'src/base/ideasEquipments/ideasEquipments.service';
import { ObjectId } from 'mongodb';

@Controller('ideasequipments')
@UseFilters(ServiceErrorCatcher)
export class IdeasEquipmentsController {
	constructor(private readonly ideasEquipmentsService: IdeasEquipmentsService) { }

	@Get()
	index(@Res() res: Response) {
		this.ideasEquipmentsService.getAllIdeasEquipments().then((ideasEquipments) => {
			return res.status(200).json(ideasEquipments);
		})
	}

	@Post('/add')
	addArticle(@Req() req: Request, @Res() res: Response) {
		this.ideasEquipmentsService.addIdea(req.body).then((ideasEquipments) => {
			return res.status(201).json(ideasEquipments);
		});
	}

	@Delete('/:id')
	deleteMaterial(@Req() req, @Res() res: Response) {
		const query = { _id: new ObjectId(req.params.id) };
		this.ideasEquipmentsService.deleteIdeaEquipment(query).then((ideasEquipments) => {
			res.status(200).json(ideasEquipments);
		});
	}
}