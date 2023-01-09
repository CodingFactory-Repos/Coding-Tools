export interface AgilityStore {
	metaProjects: Array<AgilityProjectMetaDetails>;
	metaTemplates: Array<AgilityTemplateMetaDetails>;
	currentProject: unknown;
}

export interface AgilityProjectMeta {
	metaProjects: Array<AgilityProjectMetaDetails>;
}

export interface AgilityTemplateMeta {
	metaTemplates: Array<AgilityTemplateMetaDetails>;
}

export interface AgilityProjectMetaDetails {
	snapshot: string;
	title: string;
	id: string;
}

export interface AgilityTemplateMetaDetails {
	key: string;
	url: string;
	name: string;
	isNew: boolean;
}
