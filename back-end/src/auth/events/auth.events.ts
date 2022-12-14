import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from 'src/base/users/interfaces/users.interface';

import {
	MailjetSignupPO,
	MailjetAccountValidated,
	MailjetAskActivationToken,
	MailjetAskResetToken,
} from 'src/auth/events/auth.events.req';
import { Events } from 'src/common/providers/interfaces/events.interface';

@Injectable()
export class AuthEventEmitter {
	constructor(private eventEmitter: EventEmitter2) {}

	async signupProductOwner(user: User) {
		this.eventEmitter.emit(Events.poSignup, new MailjetSignupPO(user));
	}

	async accountValidated(user: User) {
		this.eventEmitter.emit(Events.accountValidated, new MailjetAccountValidated(user));
	}

	async askActivationToken(email: string, firstName: string, token: string) {
		this.eventEmitter.emit(
			Events.askActivationToken,
			new MailjetAskActivationToken(email, firstName, token),
		);
	}

	async askResetToken(email: string, firstName: string, token: string) {
		this.eventEmitter.emit(Events.askResetToken, new MailjetAskResetToken(email, firstName, token));
	}
}
