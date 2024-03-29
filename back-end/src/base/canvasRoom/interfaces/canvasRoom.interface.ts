import { ObjectId } from 'mongodb';
import { SerializedContainer } from './ws.canvasRoom.interface';

export interface CanvasRoom extends CanvasRoomProperties {
	_id?: ObjectId;
	owner: ObjectId;
	allowedPeers: Array<ObjectId>;
	project?: Array<SerializedContainer>;
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
	ownerFirstName?: string;
	ownerLastName?: string;
}

export interface CanvasMetaDataList extends CanvasRoomProperties {
	roomId: string;
	isOwner: boolean;
}
