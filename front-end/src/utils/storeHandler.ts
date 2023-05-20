import { AxiosError } from 'axios';

type AsyncFunction = (...args: unknown[]) => Promise<unknown>;

export function withErrorHandler<T extends AsyncFunction, R extends boolean>(
	action: T,
	errors?: R
): (...args: Parameters<T>) => R extends true
	? ReturnType<T> | Promise<string>
	: ReturnType<T> | Promise<undefined>
{
	return async function (this: unknown, ...args: Parameters<T>) {
		try {
			const bindedAction = action.bind(this);
			return await bindedAction(...args);
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error(error.message);
				return errors ? error?.response.data?.message : undefined;
			}
			console.error(error);
			return undefined;
		}
	};
}
