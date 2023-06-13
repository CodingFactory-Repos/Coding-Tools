import {
	Controller,
	Get,
	Res,
	UseFilters,
	Post,
	Req,
	Delete,
	Param,
	UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { ServiceError, ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { IdeasCommentsService } from 'src/base/ideasComments/ideasComments.service';
import { ObjectId } from 'mongodb';
import { JwtAuthGuard } from '@/common/guards/auth.guard';

@Controller('ideascomments')
@UseFilters(ServiceErrorCatcher)
@UseGuards(JwtAuthGuard)
export class IdeasCommentsController {
	constructor(private readonly ideasCommentsService: IdeasCommentsService) {}

	@Get('/equipment/:id')
	async getComments(@Param() id: string, @Res() res: Response) {
		const query = { equipmentId: id };
		const ideasComments = await this.ideasCommentsService.getAllIdeasComments(query);
		return res.status(200).json(ideasComments);
	}

	@Post('/add')
	async addIdea(@Req() req: Request, @Res() res: Response) {
		const ideasComments = await this.ideasCommentsService.addIdea(req.body);
		return res.status(201).json(ideasComments);
	}

	@Delete('/:id')
	async deleteMaterial(@Param() id: string, @Res() res: Response) {
		try {
			const query = { _id: new ObjectId(id) };
			const ideasComments = await this.ideasCommentsService.deleteIdeaComment(query);
			return res.status(200).json(ideasComments);
		} catch (err) {
			throw new ServiceError('BAD_REQUEST', 'Invalid parameter url');
		}
	}
}
