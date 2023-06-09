export class MailjetRetrospectivesInvitationRequest {
	email: string;
	senderFirstName: string;
	senderLastName: string;
	projectTitle: string;
	token: string;

	constructor(
		email: string,
		senderFirstName: string,
		senderLastName: string,
		projectTitle: string,
		token: string,
	) {
		this.email = email;
		this.senderFirstName = senderFirstName;
		this.senderLastName = senderLastName;
		this.projectTitle = projectTitle;
		this.token = token;
	}
}
