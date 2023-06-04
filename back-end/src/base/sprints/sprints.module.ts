import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { SprintsService } from 'src/base/sprints/sprints.service';
import { SprintsRepository } from 'src/base/sprints/sprints.repository';
import { SprintsController } from 'src/base/sprints/sprints.controller';

@Module({
	imports: [
		DatabaseModule,
		forwardRef(() => AuthModule),
	],
	providers: [SprintsService, SprintsRepository, UsersRepository],
	controllers: [SprintsController],
	exports: [SprintsService, SprintsRepository],
})
export class SprintsModule {}
