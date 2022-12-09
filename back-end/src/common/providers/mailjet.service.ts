import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { MailjetSignupPO } from 'src/auth/events/auth.events.req';
import { Events } from 'src/common/providers/interfaces/events.interface';

Injectable();
export class MailjetListeners {
	@OnEvent(Events.poSignup)
	async handleSingupPo(payload: MailjetSignupPO) {
		//! Remove them
		console.log('This function will handle mailjet business logic when a po signup');
		console.log('PAYLOAD ::', payload);
	}
}
