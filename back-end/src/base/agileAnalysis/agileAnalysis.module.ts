import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { AgileAnalysisRepository } from 'src/base/agileAnalysis/agileAnalysis.repository';
import { AgileAnalysisService } from 'src/base/agileAnalysis/agileAnalysis.service';
import { AgileAnalysisController } from 'src/base/agileAnalysis/agileAnalysis.controller';

@Module({
	imports: [DatabaseModule, forwardRef(() => AuthModule)],
	providers: [AgileAnalysisService, AgileAnalysisRepository, UsersRepository],
	controllers: [AgileAnalysisController],
	exports: [AgileAnalysisService, AgileAnalysisRepository],
})
export class AgileAnalysisModule {}
