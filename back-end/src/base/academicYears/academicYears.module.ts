import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { AcademicYearsController } from 'src/base/academicYears/academicYears.controller';
import { AcademicYearsService } from 'src/base/academicYears/academicYears.service';
import { UsersRepository } from 'src/base/users/users.repository';
import { AcademicYearsRepository } from 'src/base/academicYears/academicYears.repository';

@Module({
	imports: [DatabaseModule, forwardRef(() => AuthModule)],
	providers: [AcademicYearsService, AcademicYearsRepository, UsersRepository],
	controllers: [AcademicYearsController],
	exports: [AcademicYearsService, AcademicYearsRepository],
})
export class AcademicYearModule {}
