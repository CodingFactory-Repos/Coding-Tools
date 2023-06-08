import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { GroupsRepository } from 'src/base/groups/groups.repository';
import { GroupsService } from 'src/base/groups/groups.service';
import { GroupsController } from 'src/base/groups/groups.controller';

@Module({
	imports: [DatabaseModule, forwardRef(() => AuthModule)],
	providers: [GroupsService, GroupsRepository, UsersRepository],
	controllers: [GroupsController],
	exports: [GroupsService, GroupsRepository],
})
export class GroupsModule {}
