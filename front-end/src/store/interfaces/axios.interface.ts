export type Status<I extends unknown = unknown> = I & {
	status: `${STATUS}`;
}

export enum STATUS {
	OK = 'ok',
	ERROR = 'error'
}