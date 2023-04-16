import { ObjectId } from 'mongodb';

export interface CanvasRoom extends CanvasRoomProperties {
	_id?: ObjectId;
	owner: ObjectId;
	allowedPeers: Array<ObjectId>;
	project?: any;
}

export interface CanvasRoomProperties {
	meta: CanvasRoomMeta;
	lastUpdatedAt: Date | string;
	createdAt: Date | string;
}

export interface CanvasRoomMeta {
	title: string;
	description: string;
	snapshot: string;
	readonly: boolean;
}

export interface CanvasMetaDataList extends CanvasRoomProperties {
	roomId: string;
	isOwner: boolean;
}