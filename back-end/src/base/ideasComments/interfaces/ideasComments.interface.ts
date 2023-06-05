import { ObjectId, Timestamp } from 'mongodb';
import { IdeaEquipment } from '../../ideasEquipments/interfaces/ideasEquipments.interface';

export interface IdeaComment {
	_id?: ObjectId;
	comment: string;
	date: Date;
	userId: ObjectId;
	equipmentId: ObjectId;
}
