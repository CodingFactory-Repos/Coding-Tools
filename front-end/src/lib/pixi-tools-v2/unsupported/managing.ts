//@ts-nocheck
import { ConfigBluePrint } from '../types/blueprint-manager';

export class Managed implements ConfigBluePrint.Config, ConfigBluePrint.ListOfBluePrintConfig {
	// Define the list of existing blueprints
	NumberOfBlueprint: ConfigBluePrint.Config[];
	SelectedIndexBlueprint: number;

	private _blueprints: ConfigBluePrint.Config;

	// Define the specific element to display
	width: number;
	height: number;
	name: string;
	type: string;
	numberOfChildren: number;

	constructor(Width: number, Height: number, Name: string, Type: string, NumberOfChildren: number) {
		let blueprint = new ConfigBluePrint.Config();
		blueprint.width = Width;
		blueprint.height = Height;
		blueprint.name = Name;
		blueprint.type = Type;
		if (NumberOfChildren != 0 || NumberOfChildren != null) {
			blueprint.numberOfChildren = NumberOfChildren;
		}
		this._blueprints = blueprint;
	}
	get blueprint() {
		return this._blueprints;
	}
}
