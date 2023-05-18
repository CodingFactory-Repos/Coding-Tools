new LibTextInput({
	input: {
		fontSize: '36px',
		padding: '2px',
		width: options.width,
		height: options.height,
		x: options.positionX,
		y: options.positionY,
		multiline: true,
		overflow: 'hidden',
	},
	box: {
		default: { fill: 0, rounded: 0, stroke: { color: 0, width: 0 } },
		focused: { fill: 0, rounded: 0, stroke: { color: 0, width: 0 } },
		disabled: { fill: 0, rounded: 0, stroke: { color: 0, width: 0 } },
	},
});