/**
 * A namespace for element options.
 * @namespace ConfigBluePrint
 */
export namespace ConfigBluePrint {
	/**
	 * Define the scaled dimensions options to transform an element.
	 * @memberof ConfigBluePrint
	 */
	export class Config {
		// Set Width and Height

		width: number;
		height: number;

		// Define the name of the configuration
		name: string;

		// Define Type is communautary or coding_service
		type: string;

		// Define the number of children to display
		numberOfChildren: number;

		// Explain to me why i create constructor for new intancied config?

		// privateConstructor(width: number, height: number, name: string, type: string) {
		//     this.width = width;

		// };
	}

	export interface ListOfBluePrintConfig {
		NumberOfBlueprint: Config[];
		SelectedIndexBlueprint: number;
	}
}
