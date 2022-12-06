import { config } from 'dotenv';
config();

import App from './app';
import { AuthController } from '@/api/auth/auth.controller';
import { ExampleController } from '@/api/base/example/example.controller';
import { UsersController } from '@/api/base/users/users.controller';

const app = new App([AuthController, ExampleController, UsersController]);

app.listen();
