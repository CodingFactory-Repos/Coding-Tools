import { Controller, Get } from 'routing-controllers';

@Controller()
export class ExampleController {
	@Get('/')
	index() {
		return 'OK';
	}
}
