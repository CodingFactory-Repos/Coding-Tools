import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { ArticlesRepository } from 'src/base/articles/articles.repository';
import { ArticlesService } from 'src/base/articles/articles.service';
import { ArticlesController } from 'src/base/articles/articles.controller';

@Module({
	imports: [DatabaseModule, forwardRef(() => AuthModule)],
	providers: [ArticlesService, ArticlesRepository, UsersRepository],
	controllers: [ArticlesController],
	exports: [ArticlesService, ArticlesRepository],
})
export class ArticlesModule {}
