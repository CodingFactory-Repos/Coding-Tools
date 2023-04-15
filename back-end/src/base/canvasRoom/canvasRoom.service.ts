import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { CanvasRoomRepository } from '@/base/canvasRoom/canvasRoom.repository';
import { UsersRepository } from 'src/base/users/users.repository';

@Injectable()
export class CanvasRoomService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => CanvasRoomRepository))
		private usersRepository: UsersRepository,
		private CanvasRoomRepository: CanvasRoomRepository,
	) {}

	// Business logic methods goes there...
	// Define your own methods
}
