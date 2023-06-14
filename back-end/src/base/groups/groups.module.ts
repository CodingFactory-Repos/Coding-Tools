import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { GroupsRepository } from 'src/base/groups/groups.repository';
import { GroupsService } from 'src/base/groups/groups.service';
import { GroupsController } from 'src/base/groups/groups.controller';
import { JwtService } from '@nestjs/jwt';
import { CoursesRepository } from '../courses/courses.repository';
import { RetrospectivesRepository } from '../retrospectives/retrospectives.repository';
import { CanvasRoomRepository } from '../canvasRoom/canvasRoom.repository';

@Module({
	imports: [DatabaseModule, forwardRef(() => AuthModule)],
	providers: [
		JwtService,
		GroupsService,
		GroupsRepository,
		UsersRepository,
		CoursesRepository,
		RetrospectivesRepository,
		CanvasRoomRepository,
	],
	controllers: [GroupsController],
	exports: [GroupsService, GroupsRepository],
})
export class GroupsModule {}
