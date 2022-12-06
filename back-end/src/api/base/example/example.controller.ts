import {
	Controller,
	Get,
} from '@decorators/express';

@Controller('/')
export class ExampleController {
	@Get('')
	index() {
		return 'OK';
	}
}
