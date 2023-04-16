export const temporaryNotification = (bg: string, color: string, text: string): void => {
	const existingContainer = document.querySelector('.temporary-notification-container');
	const root = document.querySelector('#main-content');
	if (!root) return;

	const p = document.createElement('p');
	const div = document.createElement('div');
	let container: HTMLDivElement;

	if (existingContainer === null) {
		container = document.createElement('div');
		container.classList.add('temporary-notification-container');
	}

	div.classList.add('temporary-notification');
	div.style.background = bg;
	div.style.opacity = '1';
	p.style.color = color;
	p.style.textAlign = 'center';
	p.textContent = text;
	div.appendChild(p);

	if (container) {
		container.appendChild(div);
		root.appendChild(container);
	} else {
		existingContainer.appendChild(div);
	}

	setTimeout(() => {
		div.style.opacity = '0';

		setTimeout(() => {
			div.remove();
		}, 500);
	}, 2500);
};
