import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { MailjetEmail, MailjetAskToken } from 'src/auth/events/auth.events.req';
import { Events } from 'src/common/providers/interfaces/events.interface';

@Injectable()
export class AuthEventEmitter {
	constructor(private eventEmitter: EventEmitter2) {}

	async signupProductOwner(email: string, firstName: string) {
		this.eventEmitter.emit(Events.alertPedago, new MailjetEmail(email, firstName));
	}

	async accountValidated(email: string, firstName: string) {
		this.eventEmitter.emit(Events.accountValidated, new MailjetEmail(email, firstName));
	}

	async askActivationToken(email: string, firstName: string, token: string) {
		this.eventEmitter.emit(Events.askActivationToken, new MailjetAskToken(email, firstName, token));
	}

	async askResetToken(email: string, firstName: string, token: string) {
		this.eventEmitter.emit(Events.askResetToken, new MailjetAskToken(email, firstName, token));
	}
}
