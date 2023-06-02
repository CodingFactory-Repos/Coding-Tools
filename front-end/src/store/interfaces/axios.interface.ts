//eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export type Status<I extends unknown = unknown> = I & {
	status: `${STATUS}`;
};

export enum STATUS {
	OK = 'ok',
	ERROR = 'error',
}
