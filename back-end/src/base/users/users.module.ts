import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { DatabaseModule } from '@/external-modules/database/mongo.module';

import { UsersController } from '@/base/users/users.controller';
import { UsersService } from '@/base/users/users.service';
import { UsersRepository } from '@/base/users/users.repository';

@Module({
	imports: [DatabaseModule, forwardRef(() => AuthModule)],
	providers: [UsersService, UsersRepository],
	controllers: [UsersController],
	exports: [UsersService],
})
export class UsersModule {}
