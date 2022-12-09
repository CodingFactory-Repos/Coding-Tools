import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { AcademicYearsRepository } from 'src/base/academicYears/academicYears.repository';
import { UsersRepository } from 'src/base/users/users.repository';

@Injectable()
export class AcademicYearsService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => AcademicYearsRepository))
		private usersRepository: UsersRepository,
		private academicYearsRepository: AcademicYearsRepository,
	) {}

	// Business logic methods goes there...
	// Define your own methods
}
