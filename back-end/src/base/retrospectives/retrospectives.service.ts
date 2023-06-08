import { generateCodeToken, generateRandomToken } from '@/common/helpers/string.helper';
import { forwardRef, Inject, Injectable, Logger as NestLogger } from '@nestjs/common';

import { RetrospectivesRepository } from 'src/base/retrospectives/retrospectives.repository';
import { UsersRepository } from 'src/base/users/users.repository';
import { Retrospective } from './interfaces/retrospectives.interface';
import { ObjectId } from 'mongodb';
import { PostitDTO, RetrospectiveDTO } from './dto/retrospectives.dto';
import { ServiceError } from '@/common/decorators/catch.decorator';
import { RetrospectivesRoomInvitationRepository } from './retrospectivesRoomInvitation.repository';
import { RetrospectivesEventEmitter } from './events/retrospectives.events';
import { RetrospectiveGateway } from '@/common/gateways/retrospective.global.gateway';

@Injectable()
export class RetrospectivesService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => RetrospectivesRepository))
		private usersRepository: UsersRepository,
		private retrospectivesRepository: RetrospectivesRepository,
		private retroRoomInvitationRepository: RetrospectivesRoomInvitationRepository,
		private retrospectivesEventEmitter: RetrospectivesEventEmitter,
		private retrospectiveGateway: RetrospectiveGateway,
	) {}

	async newRetrospective(retrospective: RetrospectiveDTO, userId: ObjectId) {
		const user = await this.usersRepository.findOne({ _id: userId });
		if (user === null)
			throw new ServiceError(
				'UNAUTHORIZED',
				'You do not have the rights to access this ressource.',
			);


		const queryRetro = { "associatedCourse._id": retrospective.associatedCourse._id}
		const isCoursesAlreadyAsignated = await this.retrospectivesRepository.findOne(queryRetro);

		if (isCoursesAlreadyAsignated !== null)
			throw new ServiceError(
				'UNAUTHORIZED',
				'This course is already assigned.',
			);

		const date = new Date();

		retrospective.createdAt = date;
		retrospective.creator = user.profile.email;
		retrospective.participants.push(user.profile.email);
		const slug = generateCodeToken();
		retrospective.slug = slug;

		await this.retrospectivesRepository.createRetrospective(retrospective);

		return retrospective;
	}

	async getCurrentRetro(slug: string) {
		const tryGetCurrentRetro = await this.retrospectivesRepository.findOne({ slug: slug });
		if (tryGetCurrentRetro) return tryGetCurrentRetro;
	}

	async getRetrosByUser(userId: ObjectId) {
		const user = await this.usersRepository.findOne({ _id: userId });
		if (user === null) return;

		const query = {
			$or: [{ creator: user.profile?.email }, { participants: { $in: [user.profile?.email] } }],
		};
		const retroByUser = await this.retrospectivesRepository.findAll(query);
		return retroByUser;
	}

	async getAllRetro() {
		const allRetro = await this.retrospectivesRepository.findAll({});
		return allRetro;
	}

	async tryUpdateParticipants(retro: Retrospective) {
		const query = { slug: retro.slug };
		const update = { $set: { participants: retro.participants } };

		await this.retrospectivesRepository.updateOneRetrospective(query, update);
	}

	async createNewPostit(postit: PostitDTO, userId: ObjectId) {
		const user = await this.usersRepository.findOne({ _id: userId });

		if (user && user.profile.firstName && user.profile.lastName) {
			postit.sylable = user.profile.firstName[0] + user.profile.lastName[0];
		}

		const randomId = generateCodeToken();
		postit.id = randomId;
		return postit;
	}

	async sendRetroInvitation(targetId: string, roomId: string, userId: ObjectId) {
		try {
			if (!roomId || roomId === 'null' || roomId === 'undefined') {
				throw new ServiceError('BAD_REQUEST', 'Invalid room');
			}

			//! WARNING: Yeah there are a lot of queries there, there's a better way, but no time.

			const userQuery = { _id: userId };
			const user = await this.usersRepository.findOne(userQuery, {
				projection: { 'profile.firstName': 1, 'profile.lastName': 1, 'profile.email': 1 },
			});
			if (!user)
				throw new ServiceError(
					'UNAUTHORIZED',
					'You do not have the rights to access this ressource',
				);

			const targetObjectId = new ObjectId(targetId);
			const targetQuery = { _id: targetObjectId };
			const targetUser = await this.usersRepository.findOne(targetQuery, {
				projection: { 'profile.email': 1 },
			});
			if (!targetUser) throw new ServiceError('BAD_REQUEST', 'Invalid payload');

			const roomObjectId = roomId;
			const invitationQuery = { retroId: roomObjectId, userId: targetObjectId };
			const invitationExist =
				await this.retroRoomInvitationRepository.retrospectivesRoomInvitationExist(invitationQuery);
			if (invitationExist !== null)
				throw new ServiceError('BAD_REQUEST', 'User invitation was already sent');

			const retroQuery = { slug: roomObjectId, participants: { $in: [user.profile.email] } };
			const project = await this.retrospectivesRepository.findOne(retroQuery, {
				projection: { title: 1 },
			});
			if (!project) throw new ServiceError('BAD_REQUEST', 'Invalid payload');

			const token = generateRandomToken();
			const expireIn = Date.now() + 24 * 60 * 60 * 1000;
			await this.retroRoomInvitationRepository.createRetrospectivesRoomInvitation({
				expireAt: new Date(expireIn),
				retroId: roomObjectId,
				userId: targetObjectId,
				token,
			});

			await this.retrospectivesEventEmitter.invitationRequest(
				targetUser.profile.email,
				user.profile.firstName,
				user.profile.lastName,
				project.title,
				token,
			);
		} catch (err) {
			NestLogger.error(err.response.message, err.response.error);
			throw new ServiceError('UNAUTHORIZED', 'You do not have the rights to acces this ressource');
		}
	}

	async verifyRetroInvitation(token: string, userId: ObjectId) {
		const query = { userId, token };
		const update = { $set: { expireAt: new Date() } };
		const userInvited = await this.usersRepository.findOne({ _id: userId });
		const invitation =
			await this.retroRoomInvitationRepository.findOneAndUpdateRetrospectivesRoomInvitation(
				query,
				update,
				{ projection: { retroId: 1 } },
			);
		if (!invitation.value)
			throw new ServiceError('UNAUTHORIZED', 'You do not have the rights to access this ressource');

		await this.retrospectivesRepository.updateOneRetrospective(
			{ slug: invitation.value.retroId },
			{ $push: { allowedPeers: userInvited._id } },
		);
		return invitation.value.retroId;
	}

	async removeUserAccessToRetro(targetEmail: string, roomId: string, userId: ObjectId) {
		try {
			const userTarget = await this.usersRepository.findOne({ 'profile.email': targetEmail });
			const userCreator = await this.usersRepository.findOne({ _id: userId });

			const query = { slug: roomId, creator: userCreator.profile.email };
			const update = {
				$pull: { allowedPeers: userTarget._id, participants: userTarget.profile.email },
			};

			await this.retrospectivesRepository.updateOneRetrospective(query, update);

			const inviteQuery = { userId: userTarget._id, retroId: roomId };
			await this.retroRoomInvitationRepository.deleteOneRetrospectivesRoomInvitation(inviteQuery);

			this.retrospectiveGateway.server.to(userTarget._id.toString()).emit('accessRetro-lost');
		} catch (err) {
			if (err instanceof Error) {
				NestLogger.error(err);
			}

			throw new ServiceError('BAD_REQUEST', 'Invalid payload');
		}
	}
}
