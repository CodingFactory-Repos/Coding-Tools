import {
	Controller,
	Delete,
	Get,
	Post,
	Put,
	Req,
	Res,
	UseFilters,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { MaterialsService } from 'src/base/materials/materials.service';
import { ObjectId } from 'mongodb';
import { Jwt } from '@/common/decorators/jwt.decorator';
import { JwtAuthGuard } from '@/common/guards/auth.guard';

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
		this.materialsService.updateMaterial(query, update).then(() => {
			res.status(200).json({ message: 'Material updated' });
		});
	}
	@Put('reservation/:id')
	addReservation(@Req() req, @Res() res: Response) {
		const query = { _id: new ObjectId(req.params.id) };
		const update = { $push: { borrowingHistory: req.body.borrowingHistory } };
		// Transform the borrowingUser in ObjectId
		update.$push.borrowingHistory.borrowingUser = new ObjectId(
			update.$push.borrowingHistory.borrowingUser,
		);
		this.materialsService.addReservation(query, update).then((material) => {
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
	@Get('/user')
	@UseGuards(JwtAuthGuard)
	async getCurrentUser(@Jwt() userId: ObjectId, @Res() res: Response) {
		const user = userId;
		res.status(200).json(user);
	}

	@Get('get/:id')
	async getMaterialById(@Req() req, @Res() res: Response) {
		const id = req.params.id;
		const material = await this.materialsService.getMaterialById(id);
		res.status(200).json(material);
	}

	@Get('user/:id')
	getUserInfo(@Req() req, @Res() res: Response) {
		const id = req.params.id;
		this.materialsService.getUserInfo(id).then((response) => {
			res.status(200).json(response);
		});
	}

	@Get('user/role/:id')
	getUserRole(@Req() req, @Res() res: Response) {
		const id = req.params.id;
		this.materialsService.getUserRole(id).then((response) => {
			res.status(200).json(response.role);
		});
	}
}
