import { reactive } from "vue";
import { ContainerManager } from "../class/containerManager";
import { ViewportUI } from "../viewportUI";


export class ViewportZoomPlugin {
	protected readonly viewport: ViewportUI;
	protected readonly manager: ContainerManager;
	protected readonly MAX_ZOOM: number;
	protected readonly MIN_ZOOM: number;
	protected readonly MAX_STEP: number;
	protected readonly MULTIPLICATOR: number;
	protected CURRENT_PREV_STEP: number;
	protected CURRENT_NEXT_STEP: number;
	protected CURRENT_STEP: number;
	public ZOOM = reactive({ value: 0 });

	constructor(viewport: ViewportUI, manager: ContainerManager) {
		this.viewport = viewport;
		this.manager = manager;

		this.MAX_ZOOM = 50;
		this.MIN_ZOOM = 0.01;
		this.MAX_STEP = 14;
		this.MULTIPLICATOR = Math.pow((this.MAX_ZOOM / this.MIN_ZOOM), (1 / this.MAX_STEP));
		this._deduceZoomStep();
		this._updateZoomPercentage();
	}

	private _deduceZoomStep() {
		const offset = 0.1;
		const percentage = Math.log(this.viewport.scaled / this.MIN_ZOOM) / Math.log(this.MULTIPLICATOR);
		const prevStep = Math.floor(percentage - offset);
		const nextStep = Math.ceil(percentage + offset);
		const curStep = Math.round(percentage);
		this.CURRENT_PREV_STEP = Math.max(0, Math.min(this.MAX_STEP, prevStep));
		this.CURRENT_NEXT_STEP = Math.max(0, Math.min(this.MAX_STEP, nextStep));
		this.CURRENT_STEP = Math.max(0, Math.min(this.MAX_STEP, curStep));
	}

	private _updateZoomPercentage() {
		const { worldScreenWidth, worldScreenHeight, screenWidth, screenHeight } = this.viewport;
		const zoomPercentage = Math.round(Math.min(screenWidth / worldScreenWidth, screenHeight / worldScreenHeight) * 100);
		const multiplier = Math.pow(10, 1);
		this.ZOOM.value = Math.round(zoomPercentage * multiplier) / multiplier;
	}

	public updateZoomScale() {
		if (this.viewport.scaled > this.MAX_ZOOM) {
			this.viewport.scale.x = this.MAX_ZOOM;
			this.viewport.scale.y = this.MAX_ZOOM;
		}

		if (this.viewport.scaled < this.MIN_ZOOM) {
			this.viewport.scale.x = this.MIN_ZOOM;
			this.viewport.scale.y = this.MIN_ZOOM;
		}

		this._deduceZoomStep();
		this._updateZoomPercentage();
	}

	public updateZoomStep(value: -1 | 1) {
		const isInBounds = value + this.CURRENT_STEP <= this.MAX_STEP && value + this.CURRENT_STEP >= 0;
		if(!isInBounds) return;
		
		const gotoStep = value > 0 ? this.CURRENT_NEXT_STEP : this.CURRENT_PREV_STEP;

		let scale = this.MIN_ZOOM;
		for(let n = 0; n < gotoStep; n++) {
			scale *= this.MULTIPLICATOR;
		}

		const point = this.manager.getSelectedCenter();
		if(point) this.viewport.center = point;

		this.viewport.setZoom(scale, true);
		this.updateZoomScale();
		this.viewport.drawGrid();
	}
}