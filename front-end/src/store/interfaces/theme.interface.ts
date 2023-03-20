import { WritableComputedRef } from 'vue';

export interface ThemeStore {
	theme: WritableComputedRef<boolean>;

	switchTheme?: () => void;
}
