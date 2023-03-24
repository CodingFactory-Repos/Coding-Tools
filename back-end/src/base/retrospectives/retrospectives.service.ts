import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { RetrospectivesRepository } from 'src/base/retrospectives/retrospectives.repository';
import { UsersRepository } from 'src/base/users/users.repository';
import { DTONewRetro } from './dto/retrospectives.dto';
import { generateSlug } from '@/common/helpers/string.helper';
import { Retrospective } from './interfaces/retrospectives.interface';
import { PROJECTION_CURRENT_USER } from '@/auth/utils/auth.projection';
import { ObjectId } from 'mongodb';

@Injectable()
export class RetrospectivesService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => RetrospectivesRepository))
		private usersRepository: UsersRepository,
		private retrospectivesRepository: RetrospectivesRepository,
	) {}

	async createNewRetro(retro: DTONewRetro, userId: ObjectId) {
		const slug = generateSlug();
		const creator = await this.usersRepository.findOne({ _id: userId }, PROJECTION_CURRENT_USER);
		const newRetro: Retrospective = {
			title: retro.title,
			optionTemplate: retro.optionTemplate,
			creator: creator.profile.email,
			createdAt: new Date(),
			slug: slug
		};
		this.retrospectivesRepository.createRetrospective(newRetro);
		return newRetro;
	};
	async getCurrentRetro(idRetro: string) {
		const isCurrentRetro = await this.retrospectivesRepository.findOne({slug: idRetro});
		return isCurrentRetro;
	}
}
