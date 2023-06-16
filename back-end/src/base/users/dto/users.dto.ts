import {
	STRICT_API_URL,
	STRICT_GITHUB_URL,
	STRICT_LINKEDIN_URL,
	STRICT_URL,
} from '@/common/constants/global';
import { IsValidDatePeriod } from '@/common/validators/IsValidDatePeriod.validator';
import { IsValidGitHubStat } from '@/common/validators/IsValidGitHubStat.validator';
import { IsValidStringLength } from '@/common/validators/IsValidStringLength.validator';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsString,
	Length,
	Matches,
	Validate,
	ValidateNested,
} from 'class-validator';

class UserProfileDTO {
	@IsOptional()
	@IsString({ message: 'Invalid type format' })
	@Length(0, 300, { message: 'Your resume must be between 0 and 300 characters' })
	resume: string;

	@IsOptional()
	@IsString({ message: 'Invalid type format' })
	@Validate(IsValidStringLength, [[0, 9]])
	@Matches(/^(\d+)?$/, { message: 'Your phone number must contains only characters from 0 to 9' })
	phone: string;

	@IsOptional()
	@IsString({ message: 'Invalid type format' })
	@Validate(IsValidDatePeriod, [[-90, -13]])
	birthDate: Date;

	@IsOptional()
	@IsString({ message: 'Invalid type format' })
	@Length(0, 125, { message: 'Linkedin link must be between 0 and 125 characters' })
	@Matches(STRICT_LINKEDIN_URL, { message: 'Your linkeding profile must be a valid url' })
	linkedinProfile: string;

	@IsOptional()
	@IsString({ message: 'Invalid type format' })
	@Length(0, 75, { message: 'Github link must be between 0 and 75 characters' })
	@Matches(STRICT_GITHUB_URL, { message: 'Your github profile must be a valid url' })
	githubProfile: string;

	@IsOptional()
	@IsString({ message: 'Invalid type format' })
	@Matches(/^(.{1,32}@.{1,32})?$/, { message: 'Your discord tag must be valid' })
	discordTag: string;

	@IsOptional()
	@IsString({ message: 'Invalid type format' })
	@Length(0, 120, { message: 'Profile picture link must be between 0 and 120 characters' })
	@Matches(STRICT_API_URL, { message: 'Your profile picture must be a valid url' })
	picture: string;

	@IsOptional()
	@IsString({ message: 'Invalid type format' })
	@Length(0, 120, { message: 'Profile background link be between 0 and 120 characters' })
	@Matches(STRICT_API_URL, { message: 'Your profile background must be a valid url' })
	background: string;

	@IsOptional()
	@IsBoolean({ message: 'Invalid type format' })
	@Validate(IsValidGitHubStat)
	showGithubStat: boolean;

	//! This will need to be more strict with literal value instead of any string
	@IsOptional()
	@IsArray({ message: 'Invalid type format' })
	@IsString({ each: true })
	disciplinesLiked: Array<string>;

	@IsOptional()
	@IsString({ message: 'Invalid type format' })
	@Length(0, 75, { message: 'Portfolio link must be between 0 and 75 characters' })
	@Matches(STRICT_URL, { message: 'Your portfolio must be a valid url' })
	portfolio: string;
}

class UserSchoolProfileDTO {
	//! This will need to be more strict with literal value instead of any string
	@IsOptional()
	@IsString({ message: 'Your campus must be valid' })
	campus: string;
}

class UserBusinessProfileDTO {
	//! This will need to be more strict with literal value instead of any string
	@IsOptional()
	@IsArray({ message: 'Invalid type format' })
	@IsString({ each: true })
	disciplinesTaught: Array<string>;

	@IsOptional()
	@IsString({ message: 'Invalid type format' })
	@Length(0, 75, { message: 'The job at your company must be between 0 and 75 characters' })
	companyJob: string;

	@IsOptional()
	@IsString({ message: 'Invalid type format' })
	@Length(0, 50, { message: 'Your company name must be between 0 and 50 characters' })
	companyName: string;

	@IsOptional()
	@IsString({ message: 'Invalid type format' })
	@Length(0, 75, { message: 'The website of you company must be between 0 and 75 characters' })
	@Matches(STRICT_URL, { message: 'Your company website must be a valid url' })
	companyLink: string;

	@IsOptional()
	@IsString({ message: 'Invalid type format' })
	@Matches(STRICT_API_URL, { message: 'Your company logo must be a valid url' })
	@Length(0, 120, { message: 'Company logo link be between 0 and 120 characters' })
	companyLogo: string;

	@IsOptional()
	@IsString({ message: 'Invalid type format' })
	@Validate(IsValidDatePeriod, [[-77, 5]])
	workingFrom: Date;

	@IsOptional()
	@IsString({ message: 'Invalid type format' })
	@Validate(IsValidDatePeriod, [[-77, 5]])
	workingTo: Date;
}

export class ProfileBodyDTO {
	@IsOptional()
	@ValidateNested({ message: 'Invalid user profile' })
	@IsNotEmpty()
	@IsObject()
	@Type(() => UserProfileDTO)
	profile: UserProfileDTO;

	@IsOptional()
	@ValidateNested()
	@IsNotEmpty()
	@IsObject()
	@Type(() => UserSchoolProfileDTO)
	schoolProfile: UserSchoolProfileDTO;

	@IsOptional()
	@ValidateNested()
	@IsNotEmpty()
	@IsObject()
	@Type(() => UserBusinessProfileDTO)
	businessProfile: UserBusinessProfileDTO;

	@IsOptional()
	@IsBoolean()
	enable2FA: boolean;
}
