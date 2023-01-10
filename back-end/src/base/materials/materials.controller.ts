import { Controller, Delete, Get, Post, Put, Req, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { MaterialsService } from 'src/base/materials/materials.service';
import { ObjectId } from 'mongodb';

@Controller('materials')
@UseFilters(ServiceErrorCatcher)
export class MaterialsController {
	constructor(private readonly materialsService: MaterialsService) {}

	@Get('')
	index(@Res() res: Response) {
		this.materialsService.getAllMaterials().then((materials) => {
			res.status(200).json(materials);
		});
	}
	@Post('/create')
	createMaterial(@Req() req, @Res() res: Response) {
		this.materialsService.createNewMaterial(req.body).then((material) => {
			res.status(200).json(material);
		});
	}
	@Put('/update/:id')
	updateMaterial(@Req() req, @Res() res: Response) {
		const query = { _id: new ObjectId(req.params.id) };
		const update = { $set: req.body };
		this.materialsService.updateMaterial(query, update).then((material) => {
			res.status(200).json(material);
		});
	}
	@Delete('/delete/:id')
	deleteMaterial(@Req() req, @Res() res: Response) {
		const query = { _id: new ObjectId(req.params.id) };
		this.materialsService.deleteMaterial(query).then((material) => {
			res.status(200).json(material);
		});
	}
}
