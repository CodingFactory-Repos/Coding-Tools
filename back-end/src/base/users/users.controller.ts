import { Controller, Delete, Get, Post, Put, Req, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { UsersService } from 'src/base/users/users.service';

@Controller('users')
@UseFilters(ServiceErrorCatcher)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('')
	index(@Res() res: Response) {
		this.usersService.getAllUsers().then((users) => {
			res.status(200).json(users);
		});
	}
}
