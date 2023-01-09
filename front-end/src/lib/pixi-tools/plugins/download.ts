import { jsPDF } from 'jspdf';
import { autoDetectRenderer, Container } from 'pixi.js';
import { DownloadType, PixiEvents, PixiObject } from '../types';

/**
 * A plugin that adds download functionality to a PixiObject.
 *
 * The plugin support 4 types of download as of 25-12-2022 :
 * - png
 * - jpg
 * - webp
 * - pdf
 *
 * @extends PixiEvents
 * @template T - The type of PixiObject that the plugin is applied to.
 */
export class DownloadPlugin<T extends PixiObject> extends PixiEvents {
	/**
	 * The PixiObject that this plugin manages.
	 * @private
	 */
	private readonly _element: T;

	/**
	 * Creates an instance of DownloadPlugin.
	 * @param ref A reference to the PixiObject that the plugin will be applied to.
	 */
	constructor(ref: T) {
		super();

		this._element = ref;
	}

	/**
	 * Saves the graphics of the PixiObject as a file.
	 * @param mimeType - The MIME type of the file to be saved.
	 * @warning //! Does not manage multiple child as of 25-12-2022 !\\\
	 * @private
	 */
	private _save = (mimeType: string) => {
		const { width, height } = this._element.figure;
		const clone = this._element.figure.clone();
		clone.width = width;
		clone.height = height;

		const renderer = autoDetectRenderer({ width, height });
		const disposableStage = new Container();
		disposableStage.addChild(clone);
		renderer.render(disposableStage);

		const canvas = renderer.view;
		const imageData = canvas.toDataURL(mimeType);

		if (mimeType === DownloadType.MIME_PDF) {
			this._createPDF(imageData, width, height);
		} else {
			const extension = imageData.split(',')[0].split(';')[0].split('/')[1];
			this._download(imageData, extension);
		}
	};

	/**
	 * Creates a PDF file from the graphics of the PixiObject.
	 * @param data - The data of the image to be included in the PDF.
	 * @param width - The width of the image.
	 * @param height - The height of the image.
	 * @private
	 */
	private _createPDF(data: string, width: number, hight: number) {
		const image = new Image();
		image.src = data;

		const pdf = new jsPDF();
		pdf.addImage({
			imageData: data,
			format: 'JPEG',
			width: width,
			height: hight,
			x: 0,
			y: 0,
		});
		pdf.save('graphic.pdf');

		const dataURI = pdf.output('datauristring');
		const base64Data = dataURI.split(',')[1];
		const blob = new Blob([base64Data], { type: 'application/pdf' });
		const url = window.URL.createObjectURL(blob);

		this._download(url, 'pdf');
	}

	/**
	 * Downloads the file to the user's device.
	 * @param data - The data of the file to be downloaded.
	 * @param ext - The file extension of the file to be downloaded.
	 * @private
	 */
	private _download(data: string, ext: string) {
		const downloadLink = document.createElement('a');
		downloadLink.setAttribute('href', data);
		downloadLink.setAttribute('download', `graphic.${ext}`);
		downloadLink.style.display = 'none';
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	}

	/**
	 * Enables the download functionality for the PixiObject.
	 * @public
	 */
	public enableDownload = () => {
		this._element.dispatch.on('download', (mimeType: string) => this._save(mimeType));
	};

	/**
	 * Disables the download functionality for the PixiObject.
	 * @public
	 */
	public disabledDownload = () => {
		this._element.dispatch.off('download', this._save);
	};
}
