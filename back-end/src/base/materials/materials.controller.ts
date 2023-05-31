import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Res,
	UseFilters,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { MaterialsService } from 'src/base/materials/materials.service';
import { ObjectId } from 'mongodb';
import { JwtAuthGuard } from '@/common/guards/auth.guard';
import { DTOBorrowingMaterial, DTOCreateMaterials, DTOMaetrials } from './dto/materials.dto';

@Controller('materials')
@UseFilters(ServiceErrorCatcher)
@UseGuards(JwtAuthGuard)
export class MaterialsController {
	constructor(private readonly materialsService: MaterialsService) {}

	@Get('')
	index(@Res() res: Response) {
		this.materialsService.getAllMaterials().then((materials) => {
			res.status(200).json(materials);
		});
	}

	@Get('/stats')
	async getStats(@Res() res: Response) {
		this.materialsService.getAllMaterialsStats().then((materials) => {
			res.status(200).json(materials);
		});
	}
	@Get('/macs')
	async getMacs(@Res() res: Response) {
		this.materialsService.getAllMacs().then((materials) => {
			res.status(200).json(materials);
		});
	}

	@Post('/create')
	async createMaterial(@Body() body: DTOCreateMaterials, @Res() res: Response) {
		await this.materialsService.createNewMaterial(body).then((material) => {
			res.status(200).json(material);
		});
	}

	@Put('/update/:id')
	updateMaterial(@Param('id') id: string, @Body() body: DTOMaetrials, @Res() res: Response) {
		const query = { _id: new ObjectId(id) };
		const update = { $set: body };
		this.materialsService.updateMaterial(query, update).then((material) => {
			res.status(200).json(material);
		});
	}

	@Put('reservation/:id')
	addReservation(
		@Param('id') id: string,
		@Body() body: DTOBorrowingMaterial,
		@Res() res: Response,
	) {
		const query = { _id: new ObjectId(id) };

		// Transform the borrowingUser in ObjectId
		const update = {
			$push: { borrowingHistory: { ...body, borrowingUser: new ObjectId(body.borrowingUser) } },
		};

		console.log(update);
		this.materialsService.addReservation(query, update).then((material) => {
			res.status(200).json(material);
		});
	}

	@Delete('/delete/:id')
	deleteMaterial(@Param('id') id: string, @Res() res: Response) {
		const query = { _id: new ObjectId(id) };
		this.materialsService.deleteMaterial(query).then((material) => {
			res.status(200).json(material);
		});
	}

	@Get('get/:id')
	async getMaterialById(@Param('id') id: string, @Res() res: Response) {
		const material = await this.materialsService.getMaterialById(id);
		delete material._id;
		res.status(200).json(material);
	}
}
