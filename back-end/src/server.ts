import { config } from 'dotenv';
config();

import App from '@/app';
import { AuthController } from '@/api/auth/auth.controller';
import { UsersController } from '@/api/base/users/users.controller';
import { ExampleController } from '@/api/base/example/example.controller';

const app = new App([AuthController, UsersController, ExampleController]);

app.on('expressMounted', () => {
	app.listen();
})
