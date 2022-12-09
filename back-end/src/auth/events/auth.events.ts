import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from 'src/base/users/interfaces/users.interface';

import { MailjetSignupPO } from 'src/auth/events/auth.events.req';
import { Events } from 'src/common/providers/interfaces/events.interface';

@Injectable()
export class AuthEventEmitter {
	constructor(private eventEmitter: EventEmitter2) {}

	async signupProductOwner(user: User) {
		this.eventEmitter.emit(Events.poSignup, new MailjetSignupPO(user));
	}
}
