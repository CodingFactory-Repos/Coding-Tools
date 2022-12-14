export interface EmailConstructorOptions {
	templateId: number;
	senders?: EmailRecipient;
	recipients: Array<EmailRecipient>;
	args?: Record<string, any>;
}

export interface EmailRecipient {
	Email: string;
	Name: string;
}
