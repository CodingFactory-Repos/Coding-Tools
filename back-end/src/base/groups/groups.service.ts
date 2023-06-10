import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { GroupsRepository } from 'src/base/groups/groups.repository';
import { UsersRepository } from 'src/base/users/users.repository';
import { CoursesRepository } from '../courses/courses.repository';
import { ObjectId } from 'mongodb';
import { ServiceError } from '@/common/decorators/catch.decorator';
import { RetrospectivesRepository } from '../retrospectives/retrospectives.repository';
import { createRetroGroup } from './utils/createProject';
import { CanvasRoom } from '../canvasRoom/interfaces/canvasRoom.interface';
import { CanvasRoomRepository } from '../canvasRoom/canvasRoom.repository';

@Injectable()
export class GroupsService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => GroupsRepository))
		@Inject(forwardRef(() => CoursesRepository))
		@Inject(forwardRef(() => RetrospectivesRepository))
		@Inject(forwardRef(() => CanvasRoomRepository))
		private usersRepository: UsersRepository,
		private groupsRepository: GroupsRepository,
		private coursesRepository: CoursesRepository,
		private retrospectiveRepository: RetrospectivesRepository,
		private canvasRoomRepository: CanvasRoomRepository,
	) {}

	async lockGroup(courseId: string, userId: ObjectId) {
		const course = await this.coursesRepository.findOne({ _id: new ObjectId(courseId) });
		if (course.isLocked === true)
			throw new ServiceError('UNAUTHORIZED', 'This group is already Locked.');
		const user = await this.usersRepository.findOne({ _id: userId });

		//TODO: Waiting for the trello part
		const retro = createRetroGroup(course, user);
		course.groups.forEach(async (groups, index) => {
			const projectDocument: CanvasRoom = {
				owner: userId,
				meta: {
					title: `Group ${index + 1} ${course.tag}`,
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
			groups.group.forEach((user) => {
				projectDocument.allowedPeers.push(user);
			});
			const canvas = await this.canvasRoomRepository.createCanvasRoom(projectDocument);
			await this.coursesRepository.updateOneCourse(
				{ _id: new ObjectId(courseId) },
				{ $push: { projects: canvas.insertedId } },
			);
		});

		const newRetro = await this.retrospectiveRepository.createRetrospective(retro);
		await this.coursesRepository.updateOneCourse(
			{ _id: new ObjectId(courseId) },
			{ $set: { retro: newRetro.insertedId, isLocked: true } },
		);
	}
}
