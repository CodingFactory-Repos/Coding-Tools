import { Controller, Get, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { BoardsService } from 'src/base/boards/boards.service';

@Controller('boards')
@UseFilters(ServiceErrorCatcher)
export class BoardsController {
	constructor(private readonly boardsService: BoardsService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}
