import { ObjectId } from 'mongodb';

export interface CanvasRoomInvitation {
	token: string;
	expireAt: Date;
	canvasId: ObjectId;
	userId: ObjectId;
}
