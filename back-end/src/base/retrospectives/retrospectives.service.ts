import { generateCodeToken } from '@/common/helpers/string.helper';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { RetrospectivesRepository } from 'src/base/retrospectives/retrospectives.repository';
import { UsersRepository } from 'src/base/users/users.repository';
import { Retrospective } from './interfaces/retrospectives.interface';

@Injectable()
export class RetrospectivesService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => RetrospectivesRepository))
		private usersRepository: UsersRepository,
		private retrospectivesRepository: RetrospectivesRepository,
	) {}

	async newRetrospective(retrospective: Retrospective) {
		const slug = generateCodeToken();
		retrospective.slug = slug;

		await this.retrospectivesRepository.createRetrospective(retrospective);

		return retrospective;
	}

	async getCurrentRetro(slug: string) {
		const tryGetCurrentRetro = await this.retrospectivesRepository.findOne({ slug: slug });
		if (tryGetCurrentRetro) return tryGetCurrentRetro;
	}
}
