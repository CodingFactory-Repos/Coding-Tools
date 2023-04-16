import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { CanvasRoomRepository } from '@/base/canvasRoom/canvasRoom.repository';
import { UsersRepository } from 'src/base/users/users.repository';
import { ObjectId } from 'mongodb';
import { CanvasMetaDataList, CanvasRoom, CanvasRoomMeta } from './interfaces/canvasRoom.interface';
import { PROJECTION_PROJECT_META_LIST, PROJECTION_PROJECT } from './utils/canvasRoom.projection';
import { ServiceError } from '@/common/decorators/catch.decorator';

@Injectable()
export class CanvasRoomService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => CanvasRoomRepository))
		private usersRepository: UsersRepository,
		private canvasRoomRepository: CanvasRoomRepository,
	) {}

	async initNewProject(userId: ObjectId) {
		const projectDocument: CanvasRoom = {
			owner: userId,
			meta: {
				title: "Untilted project",
				description: null,
				snapshot: null,
				readonly: false,
			},
			allowedPeers: [userId],
			lastUpdatedAt: new Date(),
			createdAt: new Date(),
			project: [],
		}

		const room = await this.canvasRoomRepository.createCanvasRoom(projectDocument);
		return room.insertedId;
	}

	async retrieveProjectList(userId: ObjectId) {
		const query = { allowedPeers: { $in: [userId] } };
		const rooms = await this.canvasRoomRepository.findManyCanvasRoom(query, PROJECTION_PROJECT_META_LIST);
		const metaList: Array<CanvasMetaDataList> = [];

		for(let n = 0; n < rooms.length; n++) {
			const { _id, owner, ...rest } = rooms[n];

			metaList.push({
				roomId: _id.toString(),
				isOwner: owner.toString() === userId.toString(),
				...rest
			})
		}

		return metaList;
	}

	async retrieveProject(roomId: string, userId: ObjectId) {
		if(!roomId || roomId === 'null' || roomId === 'undefined')
			throw new ServiceError("UNAUTHORIZED", "You do not have the rights to access this ressource");

		const query = { _id: new ObjectId(roomId), allowedPeers: { $in: [userId] } };
		const room = await this.canvasRoomRepository.findOneCanvasRoom(query, PROJECTION_PROJECT);
		if(room === null)
			throw new ServiceError("UNAUTHORIZED", "You do not have the rights to access this ressource");

		return room.project;
	}

	async saveProjectMeta(meta: CanvasRoomMeta, roomId: string, userId: ObjectId) {
		if(!roomId || roomId === 'null' || roomId === 'undefined')
			throw new ServiceError("UNAUTHORIZED", "You do not have the rights to access this ressource");

		const lastUpdatedAt = new Date();

		if(meta.readonly) {
			const query = { _id: new ObjectId(roomId), owner: userId };
			const isOwner = await this.canvasRoomRepository.canvasRoomExist(query);
			if(isOwner === null)
				throw new ServiceError("UNAUTHORIZED", "You do not have the rights to access this ressource");

			const update = { $set: { meta: meta, lastUpdatedAt } };
			const room = await this.canvasRoomRepository.updateOneCanvasRoom(query, update);

			if(room.modifiedCount === 0)
				throw new ServiceError("BAD_REQUEST", "Invalid payload");
		} else {
			const query = { _id: new ObjectId(roomId), allowedPeers: { $in: [userId] } };
			const hasAccess = await this.canvasRoomRepository.canvasRoomExist(query);
			if(hasAccess === null)
				throw new ServiceError("UNAUTHORIZED", "You do not have the rights to access this ressource");

			const update = { $set: { meta: meta, lastUpdatedAt } };
			const room = await this.canvasRoomRepository.updateOneCanvasRoom(query, update);
	
			if(room.modifiedCount === 0)
				throw new ServiceError("BAD_REQUEST", "Invalid payload");
		}

		return lastUpdatedAt;
	}
}
