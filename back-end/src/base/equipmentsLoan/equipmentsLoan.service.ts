import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { EquipmentsLoanRepository } from 'src/base/equipmentsLoan/equipmentsLoan.repository';
import { UsersRepository } from 'src/base/users/users.repository';

@Injectable()
export class EquipmentsLoanService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => EquipmentsLoanRepository))
		private usersRepository: UsersRepository,
		private equipmentsLoanRepository: EquipmentsLoanRepository,
	) {}

	// Business logic methods goes there...
	// Define your own methods
}
