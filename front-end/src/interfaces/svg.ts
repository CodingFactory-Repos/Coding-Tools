export interface SvgOptions {
	name: string;
	className?: string;
	size?: string;
	color?: string;
}

export interface SvgIcons {
	[key: string]: (data: Partial<SvgOptions>) => JSX.Element;
}
