import { Controller, Get, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { CanvasRoomService } from '@/base/canvasRoom/canvasRoom.service';

@Controller('canvasroom')
@UseFilters(ServiceErrorCatcher)
export class CanvasRoomController {
	constructor(private readonly CanvasRoomService: CanvasRoomService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}
