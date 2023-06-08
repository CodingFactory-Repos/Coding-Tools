import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Events } from '@/common/providers/interfaces/events.interface';
import { MailjetRetrospectivesInvitationRequest } from '@/base/retrospectives/events/retrospectives.events.req';

@Injectable()
export class RetrospectivesEventEmitter {
	constructor(private eventEmitter: EventEmitter2) {}

	async invitationRequest(
		email: string,
		senderFirstName: string,
		senderLastName: string,
		projectTitle: string,
		token: string,
	) {
		this.eventEmitter.emit(
			Events.retroInvitationRequest,
			new MailjetRetrospectivesInvitationRequest(
				email,
				senderFirstName,
				senderLastName,
				projectTitle,
				token,
			),
		);
	}
}
