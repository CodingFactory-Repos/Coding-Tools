import { Controller, Get } from 'routing-controllers';

@Controller('users')
export class UsersController {
	@Get('/')
	index() {
		return 'OK';
	}
}
