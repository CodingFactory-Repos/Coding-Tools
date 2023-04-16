import { Body, Controller, Get, Param, Post, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { CanvasRoomService } from '@/base/canvasRoom/canvasRoom.service';
import { Jwt } from '@/common/decorators/jwt.decorator';
import { ObjectId } from 'mongodb';
import { JwtAuthGuard } from '@/common/guards/auth.guard';

@Controller('canvas-room')
@UseFilters(ServiceErrorCatcher)
export class CanvasRoomController {
	constructor(private readonly canvasRoomService: CanvasRoomService) {}

	@Post('new')
	@UseGuards(JwtAuthGuard)
	async createNewProject(@Jwt() userId: ObjectId, @Res() res: Response) {
		const roomId = await this.canvasRoomService.initNewProject(userId);
		return res.status(201).json({ status: 'ok', roomId });
	}

	@Get('list')
	@UseGuards(JwtAuthGuard)
	async retrieveProjectList(@Jwt() userId: ObjectId, @Res() res: Response) {
		const metaList = await this.canvasRoomService.retrieveProjectList(userId);
		return res.status(201).json({ status: 'ok', projects: metaList });
	}

	@Get(':roomId')
	@UseGuards(JwtAuthGuard)
	async retrieveProject(@Jwt() userId: ObjectId, @Param('roomId') roomId: string, @Res() res: Response) {
		const project = await this.canvasRoomService.retrieveProject(roomId, userId);
		return res.status(201).json({ status: 'ok', project });
	}
}
