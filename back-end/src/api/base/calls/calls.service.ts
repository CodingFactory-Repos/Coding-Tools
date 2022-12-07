import { CallsRepository } from './calls.repository';

class CallsService {
	public repo = new CallsRepository();

	// Business logic methods goes there...
}

export default CallsService;
