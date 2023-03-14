import { AxiosError } from 'axios';

type AsyncFunction = (...args: any[]) => Promise<any>;

export function withErrorHandler<T extends AsyncFunction> (action: T): (...args: Parameters<T>) => ReturnType<T> | Promise<undefined> {
	return async function(this: unknown, ...args: Parameters<T>) {
		try {
			const bindedAction = action.bind(this);
			return await bindedAction(...args);
		} catch (error) {
			if(error instanceof AxiosError) {
				console.error(error.message);
				return undefined;
			}
			console.error(error);
			return undefined;
		}
	};
}