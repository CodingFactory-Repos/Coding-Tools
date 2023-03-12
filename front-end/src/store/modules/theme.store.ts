import { useDark, useToggle } from '@vueuse/core'
import { defineStore } from 'pinia';

import { KeysRequired } from '../../interfaces/advanced-types.interface';
import { ThemeStore } from '../interfaces/theme.interface';
import { pick } from '../../utils/object.helper';

const themeStoreDefaultState = (): ThemeStore => ({
	theme: useDark()
})

export const useThemeStore = defineStore('theme', {
	state: (): ThemeStore => themeStoreDefaultState(),
	actions: {
		switchTheme(this: ThemeStore) {
			const currentTheme = useDark();
			useToggle(currentTheme)();
			this.theme = currentTheme;
		},
		reset(this: ThemeStore, keys?: Array<KeysRequired<ThemeStore>>) {
			Object.assign(this, keys?.length
				? pick(themeStoreDefaultState(), keys)
				: themeStoreDefaultState() // if no keys provided, reset all
			);
		}
	},
});