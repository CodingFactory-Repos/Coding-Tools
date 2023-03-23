import { Controller, Get, Res, UseFilters, UseGuards, Param } from '@nestjs/common';
import { Response } from 'express';
import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { CallsService } from 'src/base/calls/calls.service';
import { JwtAuthGuard } from '@/common/guards/auth.guard';
import { Jwt } from '@/common/decorators/jwt.decorator';
import { ObjectId } from 'mongodb';
import { CourseIdObject, JwtQRCode } from '@/base/calls/interfaces/calls.interface';

@Controller('calls')
@UseFilters(ServiceErrorCatcher)
export class CallsController {
	constructor(private readonly callsService: CallsService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}

	@Get('/qrcode_generator/:courseId')
	@UseGuards(JwtAuthGuard)
	async generator(
		@Jwt() userId: ObjectId,
		@Param() courseId: CourseIdObject,
		@Res() res: Response,
	) {
		const qrcode = await this.callsService.generator(userId, courseId);
		return res.status(201).json({ status: 'ok', qrcode: qrcode });
	}
	@Get('/presence/:jwt')
	async presence(@Param() param: JwtQRCode, @Res() res: Response) {
		const message = await this.callsService.updateUserPresence(param.jwt, true);
		return res.status(201).json({ status: message });
	}
	@Get('/actual_course')
	@UseGuards(JwtAuthGuard)
	async actualCourse(@Jwt() userId: ObjectId, @Res() res: Response) {
		const actualCourse = await this.callsService.getActualCourse(userId);
		return res.status(201).json({ status: 'ok', actualCourse: actualCourse });
	}
}
