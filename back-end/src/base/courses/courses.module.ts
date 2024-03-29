import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { CoursesRepository } from 'src/base/courses/courses.repository';
import { CoursesService } from 'src/base/courses/courses.service';
import { CoursesController } from 'src/base/courses/courses.controller';
import { CanvasRoomRepository } from '../canvasRoom/canvasRoom.repository';
import { RetrospectivesRepository } from '../retrospectives/retrospectives.repository';

@Module({
	imports: [DatabaseModule, forwardRef(() => AuthModule)],
	providers: [
		CoursesService,
		CoursesRepository,
		UsersRepository,
		CanvasRoomRepository,
		RetrospectivesRepository,
	],
	controllers: [CoursesController],
	exports: [CoursesService, CoursesRepository],
})
export class CoursesModule {}
