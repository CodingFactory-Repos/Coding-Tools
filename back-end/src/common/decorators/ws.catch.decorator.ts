import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

const ERRORS = {
	BAD_REQUEST: { status: HttpStatus.BAD_REQUEST, message: 'Bad request' },
	UNAUTHORIZED: { status: HttpStatus.UNAUTHORIZED, message: 'Unauthorized' },
	FORBIDDEN: { status: HttpStatus.FORBIDDEN, message: 'Forbidden' },
};

export class WSServiceError extends WsException {
	constructor(STATUS: keyof typeof ERRORS, error: string) {
		const { status, message } = ERRORS[STATUS];
		super({ message: message, error: error, status });
	}
}

@Catch(WSServiceError)
export class WSServiceErrorCatcher implements BaseWsExceptionFilter {
	handleError<TClient extends { emit: Function }>(client: TClient, exception: unknown): void {
		throw exception;
	}
	handleUnknownError<TClient extends { emit: Function }>(
		exception: unknown,
		client: TClient,
	): void {
		throw exception;
	}
	isExceptionObject(err: unknown): err is Error {
		return err instanceof Error;
	}

	catch(exception: WSServiceError, host: ArgumentsHost) {
		const ctx = host.switchToWs();
		const client = ctx.getClient();
		const response = exception.getError();

		client.emit('exception', response);
	}
}
