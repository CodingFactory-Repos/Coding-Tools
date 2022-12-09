import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { AgileAnalysisRepository } from 'src/base/agileAnalysis/agileAnalysis.repository';
import { UsersRepository } from 'src/base/users/users.repository';

@Injectable()
export class AgileAnalysisService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => AgileAnalysisRepository))
		private usersRepository: UsersRepository,
		private agileAnalysisRepository: AgileAnalysisRepository,
	) {}

	// Business logic methods goes there...
	// Define your own methods
}
