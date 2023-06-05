import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
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
import { ObjectId, Db } from 'mongodb';
import { JwtAuthGuard } from '@/common/guards/auth.guard';
import { DTOBorrowingMaterial, DTOCreateMaterials, DTOMaetrials } from './dto/materials.dto';

@Controller('materials')
@UseFilters(ServiceErrorCatcher)
@UseGuards(JwtAuthGuard)
export class MaterialsController {
	constructor(
		@Inject('DATABASE_CONNECTION') private db: Db,
		private readonly materialsService: MaterialsService,
	) {}

	@Get('')
	index(@Res() res: Response) {
		this.materialsService.getAllMaterials().then((materials) => {
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
		// Add and objectId to the borrowingID
		update.$push.borrowingHistory.borrowingID = new ObjectId(body.borrowingID);

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

	@Get('pendingReservation')
	async getPendingReservation(@Res() res: Response) {
		const materials = await this.materialsService.getPendingReservation();
		res.status(200).json(materials);
	}

	@Put('reservation/accept/:id')
	async acceptReservation(
		@Param('id') id: string,
		@Body() body: DTOBorrowingMaterial,
		@Res() res: Response,
	) {
		const query = { _id: new ObjectId(id) };
		const update = {
			$set: {
				status: false,
				'borrowingHistory.$[elem].status': 'ACCEPTED',
			},
		};
		const options = {
			arrayFilters: [{ 'elem.borrowingID': new ObjectId(body.borrowingID) }],
		};
		try {
			const material = await this.materialsService.acceptReservation(query, update, options);
			res.status(200).json(material);
		} catch (err) {
			res.status(400).json(err);
		}
	}
	@Put('reservation/decline/:id')
	async decilneReservation(
		@Param('id') id: string,
		@Body() body: DTOBorrowingMaterial,
		@Res() res: Response,
	) {
		const query = { _id: new ObjectId(id) };
		const update = {
			$set: {
				'borrowingHistory.$[elem].status': 'DECLINED',
			},
		};
		const options = {
			arrayFilters: [{ 'elem.borrowingID': new ObjectId(body.borrowingID) }],
		};
		try {
			const material = await this.materialsService.declineReservation(query, update, options);
			res.status(200).json(material);
		} catch (err) {
			res.status(400).json(err);
		}
	}
	@Put('reservation/return/:id/')
	async returnMaterial(
		@Param('id') id: string,
		@Body() body: DTOBorrowingMaterial,
		@Res() res: Response,
	) {
		const query = { _id: new ObjectId(id) };
		const updateSet = {
			$set: {
				status: true,
				'borrowingHistory.$[elem].status': 'RETURNED',
				'borrowingHistory.$[elem].returnedTo': new ObjectId(body.returnedTo),
				'borrowingHistory.$[elem].dateReturned': new Date(Date.now()),
			},
		};
		const options = {
			arrayFilters: [{ 'elem.borrowingID': new ObjectId(body.borrowingID) }],
		};
		try {
			const material = await this.materialsService.returnMaterial(query, updateSet, options);
			res.status(200).json(material);
		} catch (err) {
			res.status(400).json(err);
		}
	}
	@Get('users/:id')
	async getUserById(@Param('id') id: string, @Res() res: Response) {
		// put id in objectId property
		const _id = new ObjectId(id);
		const user = await this.db.collection('users').findOne({ _id: _id });
		res.status(200).json(user);
	}
}
