import { AgilityProjectMeta } from '../store/interfaces/agility.interface';

import { AgilityTemplateMeta } from '@/store/interfaces/agility.interface';
import { Status } from '@/store/interfaces/axios.interface';
import { AxiosResponse } from 'axios';

export const apiTryGetTemplatesMeta = () => {
	// Call

	return Promise.resolve<Partial<AxiosResponse<Status<AgilityTemplateMeta>, unknown>>>({
		data: {
			status: 'ok',
			metaTemplates: [
				{
					key: 'something',
					url: 'https://bluemelondesign.com/wp-content/uploads/2020/11/Body-Image-1-1024x597.png',
					name: 'empathy map',
					isNew: false,
				},
				{
					key: 'something',
					url: 'https://slidemodel.com/wp-content/uploads/01-preparing-an-elevator-pitch-cover.png',
					name: 'elevator pitch',
					isNew: true,
				},
				{
					key: 'something',
					url: 'https://draft.io/assets/site/examples/light/en/1200/example-impact-mapping-3e12e17fb4ab1cdd63cd08c3561c3cda.webp',
					name: 'impact mapping',
					isNew: true,
				},
				{
					key: 'something',
					url: 'https://www.imagescreations.fr/wp-content/uploads/persona_emma-1200x800.jpg',
					name: 'personas',
					isNew: true,
				},
			],
		},
	});
};

export const apiTryGetProjectsMeta = () => {
	// Call

	return Promise.resolve<Partial<AxiosResponse<Status<AgilityProjectMeta>, unknown>>>({
		data: {
			status: 'ok',
			metaProjects: [],
		},
	});
};
