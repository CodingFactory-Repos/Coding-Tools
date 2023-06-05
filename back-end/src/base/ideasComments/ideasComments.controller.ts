import { Controller, Get, Res, UseFilters, Post, Req, Delete } from '@nestjs/common';
import { Response, Request } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { IdeasCommentsService } from 'src/base/ideasComments/ideasComments.service';
import { ObjectId } from 'mongodb';

@Controller('ideascomments')
@UseFilters(ServiceErrorCatcher)
export class IdeasCommentsController {
	constructor(private readonly ideasCommentsService: IdeasCommentsService) { }
	
	@Get("/equipment/:id")
	getComments(@Req() req, @Res() res: Response) {
		console.log(req.params.id)
		const query = { equipmentId: req.params.id };
		this.ideasCommentsService.getAllIdeasComments(query).then((ideasComments) => {
			return res.status(200).json(ideasComments);
		})
	}

	@Post('/add')
	addIdea(@Req() req: Request, @Res() res: Response) {
		this.ideasCommentsService.addIdea(req.body).then((ideasComments) => {
			return res.status(201).json(ideasComments);
		});
	}

	@Delete('/:id')
	deleteMaterial(@Req() req, @Res() res: Response) {
		const query = { _id: new ObjectId(req.params.id) };
		this.ideasCommentsService.deleteIdeaComment(query).then((ideasComments) => {
			res.status(200).json(ideasComments);
		});
	}
}