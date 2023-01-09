import { StaticGraphics } from '../../class/staticGraphics';
import { ElementOptions } from '../../types';

/**
 * Class representing a static grid manager.
 * @extends StaticGraphics
 */
export class StaticGrid extends StaticGraphics {
	/**
	 * Color of the grid lines
	 */
	color: number;

	/**
	 * Creates a new StaticGrid instance awaitng for emitter events.
	 */
	constructor(darkMode: boolean) {
		super();

		this.color = darkMode ? 0x424242 : 0xdcdcdc;
		this.dispatch.on('updated', (options: ElementOptions.ScaledDimensions) =>
			this._updateGrid(options),
		);
		this.dispatch.on('cleared', () => this._clearGrid());
	}

	/**
	 * Updates the grid with new dimensions.
	 * @param {ElementOptions.ScaledDimensions} options - The new dimensions for the grid.
	 * @private
	 */
	private _updateGrid(options: ElementOptions.ScaledDimensions) {
		const gridSize = 1 * options.scale;
		const width = options.width;
		const height = options.height;

		this.clear();
		this.lineStyle(1, this.color, 1);

		for (let x = 0; x <= width; x += gridSize) {
			this.moveTo(x, 0);
			this.lineTo(x, height);
		}

		for (let y = 0; y <= height; y += gridSize) {
			this.moveTo(0, y);
			this.lineTo(width, y);
		}

		this.endFill();
	}

	/**
	 * Clears the grid.
	 * @private
	 */
	private _clearGrid() {
		this.clear();
	}
}
