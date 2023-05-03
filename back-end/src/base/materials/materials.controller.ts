import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
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

	//! TODO: Ce n'est pas protégé
	@Get('')
	index(@Res() res: Response) {
		this.materialsService.getAllMaterials().then((materials) => {
			res.status(200).json(materials);
		});
	}

	//! TODO: Ce n'est pas protégé
	@Post('/create')
	createMaterial(@Body() body: Body, @Res() res: Response) {
		this.materialsService.createNewMaterial(body).then((material) => {
			res.status(200).json(material);
		});
	}

	//! TODO: Hyper dangereux comme route, il n'y a pas de vérification du body
	//! Je peux donc envoyer n'importe quoi dans la request et ce sera validé et modifié dans mongodb.
	@Put('/update/:id')
	updateMaterial(@Param("id") id: string, @Body() body: Body, @Res() res: Response) {
		const query = { _id: new ObjectId(id) };
		const update = { $set: body };
		this.materialsService.updateMaterial(query, update).then((material) => {
			res.status(200).json(material);
		});
	}

	//! TODO: Ce n'est pas protégé
	@Put('reservation/:id')
	addReservation(@Param("id") id: string, @Body() body: Body, @Res() res: Response) {
		const query = { _id: new ObjectId(id) };
		//@ts-ignore //! borrowingHistory n'est pas typé ni vérifié
		const update = { $push: { borrowingHistory: body.borrowingHistory } };
		// Transform the borrowingUser in ObjectId
		update.$push.borrowingHistory.borrowingUser = new ObjectId(
			update.$push.borrowingHistory.borrowingUser,
		);
		this.materialsService.addReservation(query, update).then((material) => {
			res.status(200).json(material);
		});
	}

	//! TODO: Dangereux, un utilisateur non connecté peut tout supprimer.
	@Delete('/delete/:id')
	deleteMaterial(@Param("id") id: string, @Res() res: Response) {
		const query = { _id: new ObjectId(id) };
		this.materialsService.deleteMaterial(query).then((material) => {
			res.status(200).json(material);
		});
	}

	//! TODO: Cette route devra être remove.
	@Get('/user')
	@UseGuards(JwtAuthGuard)
	async getCurrentUser(@Jwt() userId: ObjectId, @Res() res: Response) {
		const user = userId;
		res.status(200).json(user);
	}

	//! TODO: Ce n'est pas protégé
	@Get('get/:id')
	async getMaterialById(@Param("id") id: string, @Res() res: Response) {
		const material = await this.materialsService.getMaterialById(id);
		res.status(200).json(material);
	}

	//! TODO: Ce n'est pas protégé
	@Get('user/:id')
	getUserInfo(@Param("id") id: string, @Res() res: Response) {
		this.materialsService.getUserInfo(id).then((response) => {
			res.status(200).json(response);
		});
	}

	//! TODO: Ce n'est pas protégé
	@Get('user/role/:id')
	getUserRole(@Param("id") id: string, @Res() res: Response) {
		this.materialsService.getUserRole(id).then((response) => {
			res.status(200).json(response.role);
		});
	}
}
