import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidStringLength', async: false })
export class IsValidStringLength implements ValidatorConstraintInterface {
	validate(value: string, args: ValidationArguments) {
		const validLengths: number[] = args.constraints[0];
		if (validLengths.includes(value.length)) {
			return true;
		}
		return false;
	}

	defaultMessage(args: ValidationArguments) {
		const validLengths: number[] = args.constraints[0];
		return `Field value must either be ${validLengths.join(' or ')}.`;
	}
}
