import { Controller, Get, Res, UseFilters, Post, Req} from '@nestjs/common';
import { Response, Request } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { IdeasEquipmentsService } from 'src/base/ideasEquipments/ideasEquipments.service';

@Controller('ideasequipments')
@UseFilters(ServiceErrorCatcher)
export class IdeasEquipmentsController {
	constructor(private readonly ideasEquipmentsService: IdeasEquipmentsService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}

	@Post('/add')
	addArticle(@Req() req: Request, @Res() res: Response) {
		this.ideasEquipmentsService.addIdea(req.body).then((ideasEquipments) => {
			return res.status(201).json(ideasEquipments);
		});
	}
}
