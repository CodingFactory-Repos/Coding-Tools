import { generateCodeToken } from '@/common/helpers/string.helper';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { RetrospectivesRepository } from 'src/base/retrospectives/retrospectives.repository';
import { UsersRepository } from 'src/base/users/users.repository';
import { Retrospective } from './interfaces/retrospectives.interface';
import { ObjectId } from 'mongodb';

@Injectable()
export class RetrospectivesService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => RetrospectivesRepository))
		private usersRepository: UsersRepository,
		private retrospectivesRepository: RetrospectivesRepository,
	) {}

	async newRetrospective(retrospective: Retrospective, userId: ObjectId) {
		const date = new Date();
		const user = await this.usersRepository.findOne({ _id: userId})
		if (user === null)
			return;

		retrospective.createdAt = date;
		retrospective.creator = user.profile.email
		retrospective.participants.push(user.profile.email)
		const slug = generateCodeToken()
		retrospective.slug = slug

		await this.retrospectivesRepository.createRetrospective(retrospective);

		return retrospective;
	}

	async getCurrentRetro(slug: string) {
		const tryGetCurrentRetro = await this.retrospectivesRepository.findOne({ slug: slug });
		if (tryGetCurrentRetro) return tryGetCurrentRetro;
	}

	async getAllRetro(userId: ObjectId) {
		const user = await this.usersRepository.findOne({ _id: userId})
		if (user === null)
			return;

		const query = {
			$or: [
				{ creator: user.profile?.email },
				{ participants: { $in: [user.profile?.email] } }
			]
		}
		const allRetro = await this.retrospectivesRepository.findAll(query);
		return allRetro;
	}

	async tryUpdateParticipants(retro: Retrospective) {
		const query = { slug: retro.slug }
		const update = { $set: { participants: retro.participants } };

		await this.retrospectivesRepository.updateOneRetrospective(query, update);
	}
}
