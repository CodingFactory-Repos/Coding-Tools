import { forwardRef, Inject, Injectable, Logger as NestLogger } from '@nestjs/common';

import { CanvasRoomRepository } from '@/base/canvasRoom/canvasRoom.repository';
import { UsersRepository } from '@/base/users/users.repository';
import { ObjectId } from 'mongodb';
import { CanvasMetaDataList, CanvasRoom, CanvasRoomMeta } from '@/base/CanvasRoom/interfaces/canvasRoom.interface';
import {
	PROJECTION_PROJECT_META_LIST,
	PROJECTION_PROJECT,
	PROJECTION_PROJECT_VERIFY,
	PROJECTION_OWNER_NAME,
} from '@/base/canvasRoom/utils/canvasRoom.projection';
import { ServiceError } from '@/common/decorators/catch.decorator';
import { CanvasRoomEventEmitter } from '@/base/canvasRoom/events/canvasRoom.events';
import { generateRandomToken } from '@/common/helpers/string.helper';
import { CanvasRoomInvitationRepository } from '@/base/canvasRoom/canvasRoomInvitation.repository';

@Injectable()
export class CanvasRoomService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => CanvasRoomRepository))
		@Inject(forwardRef(() => CanvasRoomInvitationRepository))
		private usersRepository: UsersRepository,
		private canvasRoomRepository: CanvasRoomRepository,
		private canvasRoomInvitationRepository: CanvasRoomInvitationRepository,
		private canvasRoomEventEmitter: CanvasRoomEventEmitter,
	) {}

	async initNewProject(userId: ObjectId) {
		const user = await this.usersRepository.findOne({ _id: userId }, PROJECTION_OWNER_NAME);
		if(!user) throw new ServiceError('UNAUTHORIZED', 'You do not have the rights to access this ressource');

		const projectDocument: CanvasRoom = {
			owner: userId,
			meta: {
				title: 'Untilted project',
				description: null,
				snapshot: null,
				readonly: false,
				ownerFirstName: user.profile.firstName,
				ownerLastName: user.profile.lastName,
			},
			allowedPeers: [userId],
			lastUpdatedAt: new Date(),
			createdAt: new Date(),
			project: [],
		};

		const room = await this.canvasRoomRepository.createCanvasRoom(projectDocument);
		return room.insertedId;
	}

	async retrieveProjectList(userId: ObjectId): Promise<Array<CanvasMetaDataList>> {
		const query = { allowedPeers: { $in: [userId] } };
		const rooms = await this.canvasRoomRepository.findManyCanvasRoom(
			query,
			PROJECTION_PROJECT_META_LIST,
		);

		if (rooms.length === 0) return [];
		return rooms.map((room) => {
			const { _id, owner, ...rest } = room;
			return {
				roomId: _id.toString(),
				isOwner: owner.toString() === userId.toString(),
				...rest,
			};
		});
	}

	async retrieveProject(roomId: string, userId: ObjectId) {
		if (!roomId || roomId === 'null' || roomId === 'undefined')
			throw new ServiceError('UNAUTHORIZED', 'You do not have the rights to access this ressource');

		const query = { _id: new ObjectId(roomId), allowedPeers: { $in: [userId] } };
		const room = await this.canvasRoomRepository.findOneCanvasRoom(query, PROJECTION_PROJECT);
		if (room === null)
			throw new ServiceError('UNAUTHORIZED', 'You do not have the rights to access this ressource');

		return room.project;
	}

	async deleteProject(roomId: string, userId: ObjectId) {
		if (!roomId || roomId === 'null' || roomId === 'undefined')
			throw new ServiceError('UNAUTHORIZED', 'You do not have the rights to access this ressource');

		const query = { _id: new ObjectId(roomId), owner: userId };
		const ownerOfProject = await this.canvasRoomRepository.canvasRoomExist(query);
		if(!ownerOfProject) 
			throw new ServiceError('UNAUTHORIZED', 'You do not have the rights to access this ressource');

		await this.canvasRoomRepository.deleteOneCanvasRoom(query);
	}

	async verify(roomId: string, userId: ObjectId) {
		if (!roomId || roomId === 'null' || roomId === 'undefined')
			throw new ServiceError('UNAUTHORIZED', 'You do not have the rights to access this ressource');

		const query = { _id: new ObjectId(roomId), allowedPeers: { $in: [userId] } };
		const room = await this.canvasRoomRepository.findOneCanvasRoom(
			query,
			PROJECTION_PROJECT_VERIFY,
		);
		if (room === null)
			throw new ServiceError('UNAUTHORIZED', 'You do not have the rights to access this ressource');

		return true;
	}

	async saveProjectMeta(meta: CanvasRoomMeta, roomId: string, userId: ObjectId) {
		if (!roomId || roomId === 'null' || roomId === 'undefined')
			throw new ServiceError('UNAUTHORIZED', 'You do not have the rights to access this ressource');

		const lastUpdatedAt = new Date();

		if (meta.readonly) {
			const query = { _id: new ObjectId(roomId), owner: userId };
			const isOwner = await this.canvasRoomRepository.canvasRoomExist(query);
			if (isOwner === null)
				throw new ServiceError(
					'UNAUTHORIZED',
					'You do not have the rights to access this ressource',
				);

			const update = { $set: { meta: meta, lastUpdatedAt } };
			const room = await this.canvasRoomRepository.updateOneCanvasRoom(query, update);

			if (room.modifiedCount === 0) throw new ServiceError('BAD_REQUEST', 'Invalid payload');
		} else {
			const query = { _id: new ObjectId(roomId), allowedPeers: { $in: [userId] } };
			const hasAccess = await this.canvasRoomRepository.canvasRoomExist(query);
			if (hasAccess === null)
				throw new ServiceError(
					'UNAUTHORIZED',
					'You do not have the rights to access this ressource',
				);

			const update = { $set: { meta: meta, lastUpdatedAt } };
			const room = await this.canvasRoomRepository.updateOneCanvasRoom(query, update);

			if (room.modifiedCount === 0) throw new ServiceError('BAD_REQUEST', 'Invalid payload');
		}

		return lastUpdatedAt;
	}

	async sendProjectInvitation(targetId: string, roomId: string, userId: ObjectId) {
		try {
			if(!roomId || roomId === 'null' || roomId === 'undefined') {
				throw new ServiceError("BAD_REQUEST", "Invalid room");
			}

			//! WARNING: Yeah there are a lot of queries there, there's a better way, but no time.

			const userQuery = { _id: userId };
			const user = await this.usersRepository.findOne(userQuery, { projection: { "profile.firstName": 1, "profile.lastName": 1 }});
			if(!user) throw new ServiceError("FORBIDDEN", "You do not have the rights to access this ressource");

			const targetObjectId = new ObjectId(targetId);
			const targetQuery = { _id: targetObjectId };
			const targetUser = await this.usersRepository.findOne(targetQuery, { projection: { "profile.email": 1 }});
			if(!targetUser) throw new ServiceError("BAD_REQUEST", "Invalid payload");

			const roomObjectId = new ObjectId(roomId);
			const invitationQuery = { canvasId: roomObjectId, userId: targetObjectId };
			const invitationExist = await this.canvasRoomInvitationRepository.canvasRoomInvitationExist(invitationQuery);
			if(invitationExist !== null) throw new ServiceError("BAD_REQUEST", "User invitation was already sent");

			const canvasQuery = { _id: roomObjectId, allowedPeers: { $in: [userId] } };
			const project = await this.canvasRoomRepository.findOneCanvasRoom(canvasQuery, { projection: { "meta.title": 1 }});
			if(!project) throw new ServiceError("BAD_REQUEST", "Invalid payload");

			const token = generateRandomToken();
			const expireIn = Date.now() + 24 * 60 * 60 * 1000;
			await this.canvasRoomInvitationRepository.createCanvasRoomInvitation({
				expireAt: new Date(expireIn),
				canvasId: roomObjectId,
				userId: targetObjectId,
				token,
			})

			await this.canvasRoomEventEmitter.invitationRequest(
				targetUser.profile.email,
				user.profile.firstName,
				user.profile.lastName,
				project.meta.title,
				token,
			)
		} catch(err) {
			NestLogger.error(err.response.message, err.response.error);
			throw new ServiceError("FORBIDDEN", "You do not have the rights to acces this ressource");
		}
	}
}
