import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { BoardsRepository } from 'src/base/boards/boards.repository';
import { BoardsService } from 'src/base/boards/boards.service';
import { BoardsController } from 'src/base/boards/boards.controller';

@Module({
	imports: [DatabaseModule, forwardRef(() => AuthModule)],
	providers: [BoardsService, BoardsRepository, UsersRepository],
	controllers: [BoardsController],
	exports: [BoardsService, BoardsRepository],
})
export class BoardsModule {}
