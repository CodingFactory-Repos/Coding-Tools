export type IStatus<I = Record<string, unknown>> = Partial<I> & {
	status: string;
};