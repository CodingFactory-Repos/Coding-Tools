import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
} from 'class-validator';
import { STRICT_GITHUB_URL } from '@/common/constants/global';

@ValidatorConstraint({ name: 'isValidGitHubStat', async: false })
export class IsValidGitHubStat implements ValidatorConstraintInterface {
	validate(value: boolean, args: ValidationArguments) {
		if (!value) return true;

		const githubProfile = args.object['githubProfile'];
		return githubProfile !== '' && githubProfile.match(STRICT_GITHUB_URL);
	}

	defaultMessage() {
		return 'Your github profile must be defined if you wish to enable the github stats';
	}
}
