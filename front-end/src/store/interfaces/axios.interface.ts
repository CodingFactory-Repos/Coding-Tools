export type Status<I extends object = {}> = I & {
	status: `${STATUS}`;
}

export enum STATUS {
	OK = 'ok',
	ERROR = 'error'
}