import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { ArticlesRepository } from 'src/base/articles/articles.repository';
import { ArticlesService } from 'src/base/articles/articles.service';
import { ArticlesController } from 'src/base/articles/articles.controller';

import { MailjetModule } from '@/external-modules/mailjet/mailjet.module';
import { NewTutorialEmitter } from './events/newTutorial.events';

@Module({
	imports: [DatabaseModule, MailjetModule, forwardRef(() => AuthModule)],
	providers: [ArticlesService, ArticlesRepository, UsersRepository, NewTutorialEmitter],
	controllers: [ArticlesController],
	exports: [ArticlesService, ArticlesRepository],
})
export class ArticlesModule {}
