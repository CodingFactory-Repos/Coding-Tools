import { ServiceError } from '@/common/decorators/catch.decorator';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { GroupsRepository } from 'src/base/groups/groups.repository';
import { UsersRepository } from 'src/base/users/users.repository';
import { CoursesRepository } from '../courses/courses.repository';

@Injectable()
export class GroupsService {
    constructor(
        @Inject(forwardRef(() => UsersRepository))
        @Inject(forwardRef(() => GroupsRepository))
        @Inject(forwardRef(() => CoursesRepository))
        private usersRepository: UsersRepository,
        private groupsRepository: GroupsRepository,
        private coursesRepository: CoursesRepository,
    ) {}

    async getGroup(courseId: ObjectId, groupId: number, userId: ObjectId) {
        const actualDate = new Date();

        const exist = await this.usersRepository.userExist({ _id: userId });
        if (!exist) throw new ServiceError('UNAUTHORIZED', 'You do not have the rights to access this ressource');

		const course = await this.coursesRepository.findOne({
            _id: courseId,
            `groups.${groupId}`: { $exists: true },
            periodStart: { $lte: actualDate },
            periodEnd: { $gte: actualDate },
        })

        if (!course) throw new ServiceError('NOT_FOUND', 'User group not found');
        const users = course.groups.filter((_, index) => index === groupId);
        const userData = await this.usersRepository.findMany({ _id: { $in: users } },
            { projection: { "profile.firstName": 1, "profile.lastName": 1 } }
        );

const group = {
			courseId: courseId,
            groupId: groupId,
            users: userData,
        }

        return group
    }
}
