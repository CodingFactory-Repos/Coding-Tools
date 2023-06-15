import { ObjectId } from 'mongodb';

export interface RetrospectivesRoomInvitation {
	token: string;
	expireAt: Date;
	retroId: string;
	userId: ObjectId;
}
