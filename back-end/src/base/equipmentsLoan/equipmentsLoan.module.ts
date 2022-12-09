import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { EquipmentsLoanRepository } from 'src/base/equipmentsLoan/equipmentsLoan.repository';
import { EquipmentsLoanService } from 'src/base/equipmentsLoan/equipmentsLoan.service';
import { EquipmentsLoanController } from 'src/base/equipmentsLoan/equipmentsLoan.controller';

@Module({
	imports: [DatabaseModule, forwardRef(() => AuthModule)],
	providers: [EquipmentsLoanService, EquipmentsLoanRepository, UsersRepository],
	controllers: [EquipmentsLoanController],
	exports: [EquipmentsLoanService, EquipmentsLoanRepository],
})
export class EquipmentsLoanModule {}
