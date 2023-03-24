export class MailjetEmail {
	email: string;

	constructor(email: string) {
		this.email = email;
	}
}

export class MailjetAskToken {
	email: string;
	token: string;

	constructor(email: string, token: string) {
		this.email = email;
		this.token = token;
	}
}
