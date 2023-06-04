import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { BacklogsRepository } from 'src/base/backlogs/backlogs.repository';
import { BacklogsService } from 'src/base/backlogs/backlogs.service';
import { BacklogsController } from 'src/base/backlogs/backlogs.controller';

@Module({
	imports: [DatabaseModule, forwardRef(() => AuthModule)],
	providers: [BacklogsService, BacklogsRepository, UsersRepository],
	controllers: [BacklogsController],
	exports: [BacklogsService, BacklogsRepository],
})
export class BacklogsModule {}
