import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { ProjectsRepository } from 'src/base/projects/projects.repository';
import { ProjectsService } from 'src/base/projects/projects.service';
import { ProjectsController } from 'src/base/projects/projects.controller';

@Module({
	imports: [DatabaseModule, forwardRef(() => AuthModule)],
	providers: [ProjectsService, ProjectsRepository, UsersRepository],
	controllers: [ProjectsController],
	exports: [ProjectsService, ProjectsRepository],
})
export class ProjectsModule {}
