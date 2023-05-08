import { Controller, Get, Res, UseFilters, UseGuards, Param } from '@nestjs/common';
import { Response } from 'express';
import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { CallsService } from 'src/base/calls/calls.service';
import { JwtAuthGuard } from '@/common/guards/auth.guard';
import { Jwt } from '@/common/decorators/jwt.decorator';
import { ObjectId } from 'mongodb';
import { CourseIdObject, JwtQRCode } from '@/base/calls/interfaces/calls.interface';
import { RoleValidator } from '@/common/guards/role.guard';
import { Roles } from '@/base/users/interfaces/users.interface';

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
	@UseGuards(JwtAuthGuard)
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

	@Get('/student_list/:courseId')
	@UseGuards(JwtAuthGuard)
	async studentList(@Param() courseId: CourseIdObject, @Res() res: Response) {
		const studentList = await this.callsService.getStudentList(courseId);
		return res.status(201).json({ status: 'ok', studentList: studentList });
	}

	@Get('/get_groups/:courseId')
	@UseGuards(JwtAuthGuard)
	async updateGroupStudents(@Param() courseId: CourseIdObject, @Res() res: Response) {
		const message = await this.callsService.getGroups(courseId);
		return res.status(201).json({ array: message });
	}

	@Get('/array_generator/:studentAmount/:courseId')
	@UseGuards(JwtAuthGuard)
	async arrayGenerator(
		@Param() studentAmount: { studentAmount: number },
		@Param() courseId: CourseIdObject,
		@Res() res: Response,
	) {
		const array = await this.callsService.arrayGenerator(studentAmount.studentAmount, courseId);
		return res.status(201).json({ status: 'ok', array: array });
	}

	@Get('/join_group/:courseId/:groupId')
	@UseGuards(JwtAuthGuard, new RoleValidator(Roles.STUDENT))
	async joinGroup(
		@Jwt() userId: ObjectId,
		@Param() courseId: CourseIdObject,
		@Param() groupId: string,
		@Res() res: Response,
	) {
		const message = await this.callsService.joinGroup(courseId, groupId, userId);
		return res.status(201).json({ status: message });
	}

	@Get('/create_random_groups/:courseId')
	@UseGuards(JwtAuthGuard, new RoleValidator(Roles.PRODUCT_OWNER))
	async createRandomGroups(@Param() courseId: CourseIdObject, @Res() res: Response) {
		const message = await this.callsService.createRandomGroups(courseId);
		return res.status(201).json({ status: message });
	}

	@Get('/empty_groups/:courseId')
	@UseGuards(JwtAuthGuard, new RoleValidator(Roles.PRODUCT_OWNER))
	async emptyGroups(@Param() courseId: CourseIdObject, @Res() res: Response) {
		const message = await this.callsService.emptyGroups(courseId);
		return res.status(201).json({ status: message });
	}

	@Get('/get_student_identity/:userId')
	@UseGuards(JwtAuthGuard)
	async identity(@Param() userId: { userId: ObjectId }, @Res() res: Response) {
		const message = await this.callsService.getStudentIdentity(userId.userId);
		return res.status(201).json({ identity: message });
	}

	@Get('/is_product_owner')
	@UseGuards(JwtAuthGuard, new RoleValidator(Roles.PRODUCT_OWNER))
	async isProductOwner(@Jwt() userId: ObjectId, @Res() res: Response) {
		return res.status(201).json({ isProductOwner: true });
	}
}
