import { Response } from 'express';
import { Response as Res, Controller, Get, Post, Request, Put } from '@decorators/express';
import { MaterialsRepository } from './materials.repository';
import MaterialsService from '@/api/base/materials/materials.service';

@Controller('/materials')
export class MaterialsController {
	private materialsService = new MaterialsService();

	@Get('')
	index(@Res() res: Response) {
		this.materialsService.getAllMaterials().then((materials) => {
			res.status(200).json(materials);
		});
	}

	@Post('/create')
	createMaterial(@Request() req, @Res() res: Response) {
		this.materialsService.createNewMaterial(req.body).then((material) => {
			res.status(200).json(material);
		});
	}

	@Put('/update')
	updateMaterial(@Request() req, @Res() res: Response) {}
}
