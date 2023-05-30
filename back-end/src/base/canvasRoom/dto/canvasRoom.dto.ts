import { IsNotEmpty, IsString, Length, IsOptional, IsBoolean } from 'class-validator';

export class ProjectMetaDTO {
	@IsNotEmpty()
	@IsString()
	@Length(1, 25)
	title: string;

	@IsOptional()
	@IsString()
	@Length(0, 100)
	description: string;

	@IsOptional()
	@IsString()
	snapshot: string;

	@IsOptional()
	@IsBoolean()
	readonly: boolean;
}

export class ProjectUserIdDTO {
	@IsString()
	@Length(24)
	userId: string;
}

export class ProjectInvitationVerificationDTO {
	@IsString()
	@Length(32)
	token: string;
}