//! Will throw a detailed error if at least one env variable is not valid or empty.
import '@/config/env.validator';

import { EOL } from 'os';

import App from '@/app';
import { AuthController } from '@/api/auth/auth.controller';
import { UsersController } from '@/api/base/users/users.controller';
import { ExampleController } from '@/api/base/example/example.controller';
import { mongodb } from '@/config/config';
import { IdeasEquipmentsController } from '@/api/base/ideasEquipments/ideasEquipments.controller';
import { EquipmentsLoanController } from '@/api/base/equipmentsLoan/equipmentsLoan.controller';
import { MaterialsController } from '@/api/base/materials/materials.controller';
const expressBootsrap = () => {
	mongodb.init();

	mongodb.on('initDone', () => {
		console.log(`${EOL}[EXPRESS] - Mongodb connected ✅`);

		/**
		 * App can be consider as the core module, while the controllers act as a module by themselves.
		 * A module is a distinct assembly of components that can be easily added, removed or replaced in a larger system.
		 *
		 *! Note: Obvisouly, when you create your own controller. Do not forget to add it here, otherwise it will never work.
		 */

		const app = new App([
			AuthController,
			UsersController,
			ExampleController,
			IdeasEquipmentsController,
			EquipmentsLoanController,
			MaterialsController,
		]);
		app.listen();
	});
};

expressBootsrap();
