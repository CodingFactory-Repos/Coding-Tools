import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidDatePeriod', async: false })
export class IsValidDatePeriod implements ValidatorConstraintInterface {
	validate(value: string, args: ValidationArguments) {
		const [n1, n2]: Array<number> = args.constraints[0];
		const today = new Date();
		const after = new Date();
		after.setFullYear(today.getFullYear() + n1);
		const before = new Date();
		before.setFullYear(today.getFullYear() + n2);
		const date = new Date(value);

		if (+date >= +after && +date <= +before) {
			return true;
		}
		return false;
	}

	defaultMessage(args: ValidationArguments) {
		const [n1, n2]: Array<number> = args.constraints[0];
		const today = new Date();
		const after = new Date();
		after.setFullYear(today.getFullYear() + n1);
		const before = new Date();
		before.setFullYear(today.getFullYear() + n2);

		return `Your working date must be between ${after.toDateString()} and ${before.toDateString()}.`;
	}
}
