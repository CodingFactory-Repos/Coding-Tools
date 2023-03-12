export class MailjetEmail {
	email: string;
	firstName: string;

	constructor(email: string, firstName: string) {
		this.email = email;
		this.firstName = firstName;
	}
}

export class MailjetAskToken {
	email: string;
	firstName: string;
	token: string;

	constructor(email: string, firstName: string, token: string) {
		this.email = email;
		this.firstName = firstName;
		this.token = token;
	}
}
