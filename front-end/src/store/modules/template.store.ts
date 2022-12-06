import { TemplateStore } from '../interfaces/template.interfaces';
import { defineStore } from 'pinia';

export const useTemplateStore = defineStore('template', {
	state: (): TemplateStore => {
		return {
			name: 'Store template',
			count: 0,
		};
	},
	getters: {
		// Declare `this` as parameter with the type if you want intelisense.
		// `this` is ignored when used as a parameter.
		getName(this: TemplateStore) {
			return `${this.name}`;
		},
	},
	actions: {
		increment() {
			this.count++;
		},
	},
});
