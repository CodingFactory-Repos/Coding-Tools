import { ref, watch } from 'vue';

const isClickInsideElement = (e: Event, element: HTMLElement) => {
	const target = e.target as HTMLElement;
	return element.contains(target) || target === element;
};

export function useSelect() {
	const targetElement = ref<HTMLDivElement>();
	const element = ref<HTMLDivElement>();
	const active = ref(false);

	watch(active, (val) => {
		if (val) document.addEventListener('click', onDocumentClick);
		else document.removeEventListener('click', onDocumentClick);
	});

	function onDocumentClick(e: Event) {
		if (!targetElement.value) return;

		if (!isClickInsideElement(e, targetElement.value)) {
			close();
		}
	}

	const close = () => {
		active.value = false;
		targetElement.value = undefined;
	};

	const open = () => {
		active.value = true;
		targetElement.value = element.value;
	};

	const toggle = () => {
		if (active.value) close();
		else open();
	};

	return {
		toggle,
		close,
		open,
		element,
		active,
	};
}
