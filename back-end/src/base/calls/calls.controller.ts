import { Controller, Get, Res, UseFilters, UseGuards, Param } from '@nestjs/common';
import { Response } from 'express';
import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { CallsService } from 'src/base/calls/calls.service';
import { JwtAuthGuard } from '@/common/guards/auth.guard';
import { Jwt } from '@/common/decorators/jwt.decorator';
import { ObjectId } from 'mongodb';
import { JwtQRCode } from '@/base/calls/interfaces/calls.interface';


@Controller('calls')
@UseFilters(ServiceErrorCatcher)
export class CallsController {
	constructor(private readonly callsService: CallsService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}

	@Get('/qrcode_generator')
	@UseGuards(JwtAuthGuard)
	async generator(@Jwt() userId: ObjectId, courseId: ObjectId, @Res() res: Response) {
		const qrcode = await this.callsService.generator(userId, courseId);
		return res.status(201).json({ status: 'ok', qrcode: qrcode });
	}
	@Get('/presence/:jwt')
	async presence(@Param() param: JwtQRCode, @Res() res: Response) {
		await this.callsService.updateUserPresence(param.jwt, true);
		return res.status(201).json({ status: 'ok' });
	}

	@Get('/student_list/:courseId')
	@UseGuards(JwtAuthGuard)
	async studentList(@Param() courseId: CourseIdObject, @Res() res: Response) {
		const studentIdList = await this.callsService.getStudentList(courseId);
		const studentList = await Promise.all(
			studentIdList.map(async (studentId) => {
				const student = await this.callsService.usersRepository.findOne({ _id: studentId });
				return student;
			}),
		);
		return res.status(201).json({ status: 'ok', studentList: studentList });
	}
}
