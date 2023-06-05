import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { UsersController } from 'src/base/users/users.controller';
import { UsersService } from 'src/base/users/users.service';


@Module({
	imports: [DatabaseModule, forwardRef(() => AuthModule)],
	providers: [UsersService, UsersRepository],
	controllers: [UsersController],
	exports: [UsersService, UsersRepository],
})
export class UsersModule {}
