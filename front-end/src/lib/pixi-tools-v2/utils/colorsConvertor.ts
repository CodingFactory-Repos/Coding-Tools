export const decimToHex = (color: number) => {
	return "#" + color.toString(16).padStart(6, '0');
}

export const hexToDecim = (color: string) => {
	return parseInt(color.replace("#", ""), 16);
}

export const addOpacityToHex = (hex: string, opacity: number) => {
	const alpha = Math.round(opacity * 255).toString(16);
	return hex + alpha;
}