import JSZip from 'jszip';
import { Renderer } from 'pixi.js';
import { ViewportUI } from '../viewportUI';

import type { CanvasContainer } from '../types/pixi-aliases';

export class DownloadPlugin {
	protected readonly viewport: ViewportUI;

	constructor(viewport: ViewportUI) {
		this.viewport = viewport;
	}

	public downloadOne(container: CanvasContainer, mime: string) {
		const { width, height } = container;
		const cloneContainer = container.cloneToContainer();
		const { x, y } = cloneContainer.getBounds();
		cloneContainer.position.set(-x, -y);

		const renderer = new Renderer({ resolution: devicePixelRatio + 1, width, height, backgroundAlpha: 0 });
		renderer.render(cloneContainer);

		const canvas = renderer.view;
		const imageData = canvas.toDataURL(mime);
		const extension = imageData.split(',')[0].split(';')[0].split('/')[1];

		const downloadLink = document.createElement('a');
		downloadLink.setAttribute('href', imageData);
		downloadLink.setAttribute('download', `graphic.${extension}`);
		downloadLink.style.display = 'none';
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);

		cloneContainer.destroy();
		renderer.destroy();
	}

	public async downloadMany(containers: Array<CanvasContainer>, mime: string) {
		const zip = new JSZip();

		for (let n = 0; n < containers.length; n++) {
			const container = containers[n];
			const { width, height } = container;
			const cloneContainer = container.cloneToContainer();
			const { x, y } = cloneContainer.getBounds();
			cloneContainer.position.set(-x, -y);

			const renderer = new Renderer({ resolution: devicePixelRatio + 1, width, height, backgroundAlpha: 0 });
			renderer.render(cloneContainer);

			const canvas = renderer.view;
			const imageData = canvas.toDataURL(mime);
			const extension = imageData.split(',')[0].split(';')[0].split('/')[1];
			const fileContent = imageData.split(',')[1];
			zip.file(`graphic-${n + 1}.${extension}`, fileContent, { base64: true });

			cloneContainer.destroy();
			renderer.destroy();
		}

		// generate the zip file and download it
		const zipBlob = await zip.generateAsync({ type: 'blob' });
		const downloadLink = document.createElement('a');
		downloadLink.setAttribute('href', URL.createObjectURL(zipBlob));
		downloadLink.setAttribute('download', `graphics.zip`);
		downloadLink.style.display = 'none';
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	}
}
