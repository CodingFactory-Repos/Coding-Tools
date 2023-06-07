import { Controller, Get, Res, UseFilters, Post, Req, Delete, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';

import { ServiceError, ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { IdeasEquipmentsService } from 'src/base/ideasEquipments/ideasEquipments.service';
import { ObjectId } from 'mongodb';
import { JwtAuthGuard } from '@/common/guards/auth.guard';

@Controller('ideasequipments')
@UseFilters(ServiceErrorCatcher)
@UseGuards(JwtAuthGuard)
export class IdeasEquipmentsController {
	constructor(private readonly ideasEquipmentsService: IdeasEquipmentsService) {}

	@Get()
	async index(@Res() res: Response) {
		const ideasEquipments = await this.ideasEquipmentsService.getAllIdeasEquipments();
		return res.status(200).json(ideasEquipments);
	}

	@Post('/add')
	async addArticle(@Req() req: Request, @Res() res: Response) {
		const ideasEquipments = await this.ideasEquipmentsService.addIdea(req.body);
		return res.status(201).json(ideasEquipments);
	}

	@Delete('/:id')
	async deleteMaterial(@Req() req, @Res() res: Response) {
		try {
			const query = { _id: new ObjectId(req.params.id) };
			const ideasEquipments = await this.ideasEquipmentsService.deleteIdeaEquipment(query);
			return res.status(200).json(ideasEquipments);
		} catch(err) {
			throw new ServiceError('BAD_REQUEST', 'Invalid parameter url')
		}
	}
}
