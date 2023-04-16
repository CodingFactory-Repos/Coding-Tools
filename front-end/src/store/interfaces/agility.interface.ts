export interface AgilityStore {
	projects: Array<ProjectMeta>;
	metaTemplates: Array<AgilityTemplateMetaDetails>;
	currentProject: unknown;

	tryCreateNewProject?: (this: AgilityStore) => Promise<boolean | string>;
	tryGetRoomProject?: (this: AgilityStore, roomId: string) => Promise<boolean>;
}
export interface ProjectMeta {
	roomId: string;
	isOwner: boolean;
	meta: ProjectMetaDetails;
	lastUpdatedat: Date | string;
	createdat: Date | string;
}

export interface ProjectMetaDetails {
	title: string;
	snapshot: string;
	readonly: boolean;
}




export interface AgilityTemplateMeta {
	metaTemplates: Array<AgilityTemplateMetaDetails>;
}

export interface AgilityTemplateMetaDetails {
	key: string;
	url: string;
	name: string;
	isNew: boolean;
}
