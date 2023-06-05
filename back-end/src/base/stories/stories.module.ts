import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { StoriesRepository } from 'src/base/stories/stories.repository';
import { StoriesService } from 'src/base/stories/stories.service';
import { StoriesController } from 'src/base/stories/stories.controller';

@Module({
	imports: [DatabaseModule, forwardRef(() => AuthModule)],
	providers: [StoriesService, StoriesRepository, UsersRepository],
	controllers: [StoriesController],
	exports: [StoriesService, StoriesRepository],
})
export class BacklogsModule {}
