import { MailjetService } from '@/external-modules/mailjet/mailjet.service';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { MailjetSignupPO } from 'src/auth/events/auth.events.req';
import { Events, MaijetTemplate } from 'src/common/providers/interfaces/events.interface';
import { generateRandomToken } from 'src/common/helpers/string.helper';
import { config } from 'src/config/config';

Injectable();
export class MailjetListeners {
	constructor(
		@Inject(MailjetService)
		private readonly mailjetService: MailjetService
	) {}

	@OnEvent(Events.poSignup)
	async handleSingupPo(payload: MailjetSignupPO) {
		//! Remove them
		console.log('This function will handle mailjet business logic when a po signup');
		console.log('PAYLOAD ::', payload);
	}

	@OnEvent(Events.userSignup)
	async handleSingupUser(payload: MailjetSignupPO) {
		const user = payload.user;
		const token = generateRandomToken();

		this.mailjetService.sendUniversalEmail(
			MaijetTemplate.signup,
			'Coding Tools - Activate your account',
			user.profile.email,
			'Activate your account',
			{ url: `${config.app.base}/auth/activate?token=${token}` }
		);
	}
}
