import { empathyMap } from '@/lib/pixi-tools-v2/blueprint/empathyMap';
import { pruneTheProjectTree } from '@/lib/pixi-tools-v2/blueprint/pruneTheProjectTree';
import { SerializedContainer } from '@/lib/pixi-tools-v2/types/pixi-serialize';

export interface AgilityStore {
	projects: Array<ProjectMeta>;
	metaTemplates: Array<AgilityTemplateMetaDetails>;
	currentProject: Array<SerializedContainer>;
	projectLoading: boolean;
	isOwner: boolean;

	tryCreateNewProject?: (this: AgilityStore) => Promise<boolean | string>;
	tryGetProjectsMeta?: (this: AgilityStore) => Promise<boolean>;
	tryGetRoomProject?: (this: AgilityStore, roomId: string) => Promise<boolean>;
	tryGetRoomAccess?: (this: AgilityStore, roomId: string) => Promise<boolean>;
	trySaveProjectMeta?: (this: AgilityStore) => Promise<boolean>;
	tryDeleteProject?: (this: AgilityStore, roomId: string) => Promise<boolean>;
}

export interface ProjectMeta {
	roomId: string;
	isOwner: boolean;
	meta: ProjectMetaDetails;
	lastUpdatedAt: Date | string;
	createdAt: Date | string;
}

export interface ProjectMetaDetails {
	title: string;
	description: string;
	snapshot: string;
	readonly: boolean;
	ownerFirstName: string;
	ownerLastName: string;
}

export interface AgilityTemplateMeta {
	metaTemplates: Array<AgilityTemplateMetaDetails>;
}

export interface AgilityTemplateMetaDetails {
	key: string;
	url: string;
	name: string;
	isNew: boolean;
	type: LitteralBlueprintTypes;
}

export const getAgileBlueprints = {
	elevatorpitch: null,
	empathymap: empathyMap,
	impactmapping: null,
	personas: null,
	prunetheprojecttree: pruneTheProjectTree,
};

export type LitteralBlueprintTypes = keyof typeof getAgileBlueprints;
