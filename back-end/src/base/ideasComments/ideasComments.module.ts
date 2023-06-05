import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { IdeasCommentsRepository } from 'src/base/ideasComments/ideasComments.repository';
import { IdeasCommentsService } from 'src/base/ideasComments/ideasComments.service';
import { IdeasCommentsController } from 'src/base/ideasComments/ideasComments.controller';

@Module({
	imports: [DatabaseModule, forwardRef(() => AuthModule)],
	providers: [IdeasCommentsService, IdeasCommentsRepository, UsersRepository],
	controllers: [IdeasCommentsController],
	exports: [IdeasCommentsService, IdeasCommentsRepository],
})
export class IdeasCommentsModule {}
