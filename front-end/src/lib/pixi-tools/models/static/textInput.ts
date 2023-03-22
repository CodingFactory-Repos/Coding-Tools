//@ts-nocheck
import LibraryTextInput from '../../class/lib_TextInput';

export default class TextInput extends LibraryTextInput {
	public _textInput: TextInput;
	public x: number = 0;
	public y: number = 0;
	public width: number = 0;
	public height: number = 0; // defines the height of the input
	public color; // define the color ?
	public fontsize; // define the font size;

	/**
	 * Creates a new StaticRectangle instance with a graphic rectangle shape and awaitng for emitter events.
	 * @param {TextInput} props - The props for the rectangle.
	 */
	constructor(props: TextInput) {
		super();
		const w = props.width || 100;
		const h = props.height || 100;
		const x = props.x || 0;
		const y = props.y || 0;
	}
}
