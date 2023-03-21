import { UsersService } from 'src/base/users/users.service';
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('users')
export class UsersController {
	constructor(private readonly usersSevices: UsersService) {};
	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	};

	@Get('students')
	async allStudent(@Res() res: Response) {
		const students = await this.usersSevices.getAllStudents();
		return res.status(200).json({ status: 'ok', studentList: students });
	}
}
