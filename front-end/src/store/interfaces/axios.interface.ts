export type Status<I extends Object = {}> = I & {
	status: `${STATUS}`;
}

export enum STATUS {
	OK = 'ok',
	ERROR = 'error'
}