import {
	Controller,
	Get,
} from '@decorators/express';

@Controller('/example')
export class UsersController {
	@Get('/')
	index() {
		return 'OK';
	}
}
