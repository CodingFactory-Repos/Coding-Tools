import { SvgOptions, SvgIcons } from "@/interfaces/svg";
import { SVGBurger, SVGDark, SVGDefault, SVGFilter, SVGFlagDE, SVGFlagFR, SVGFlagUS, SVGGear, SVGLight, SVGLogo, SVGApi, SVGLogout, SVGProject, SVGAdd, SVGCursor, SVGText, SVGPostIt, SVGShape, SVGFrame, SVGInfo, SVGExpand, SVGMinus, SVGArrows, SVGGroup, SVGDownload, SVGSideBar } from "@/components/common/svg";

const icons: SvgIcons = Object.create({
	add:       (data: Partial<SvgOptions>) => <SVGAdd        {...data}/>,
	api:       (data: Partial<SvgOptions>) => <SVGApi        {...data}/>,
	arrows:    (data: Partial<SvgOptions>) => <SVGArrows     {...data}/>,
	burger:    (data: Partial<SvgOptions>) => <SVGBurger     {...data}/>,
	cursor:    (data: Partial<SvgOptions>) => <SVGCursor     {...data}/>,
	dark:      (data: Partial<SvgOptions>) => <SVGDark       {...data}/>,
	download:  (data: Partial<SvgOptions>) => <SVGDownload   {...data}/>,
	expand:    (data: Partial<SvgOptions>) => <SVGExpand     {...data}/>,
	filter:    (data: Partial<SvgOptions>) => <SVGFilter     {...data}/>,
	flagDE:    (data: Partial<SvgOptions>) => <SVGFlagDE     {...data}/>,
	flagUS:    (data: Partial<SvgOptions>) => <SVGFlagUS     {...data}/>,
	flagFR:    (data: Partial<SvgOptions>) => <SVGFlagFR     {...data}/>,
	frame:     (data: Partial<SvgOptions>) => <SVGFrame      {...data}/>,
	info:      (data: Partial<SvgOptions>) => <SVGInfo       {...data}/>,
	gear:      (data: Partial<SvgOptions>) => <SVGGear       {...data}/>,
	group:     (data: Partial<SvgOptions>) => <SVGGroup      {...data}/>,
	light:     (data: Partial<SvgOptions>) => <SVGLight      {...data}/>,
	logo:      (data: Partial<SvgOptions>) => <SVGLogo       {...data}/>,
	logout:    (data: Partial<SvgOptions>) => <SVGLogout     {...data}/>,
	minus:     (data: Partial<SvgOptions>) => <SVGMinus      {...data}/>,
	postit:    (data: Partial<SvgOptions>) => <SVGPostIt     {...data}/>,
	project:   (data: Partial<SvgOptions>) => <SVGProject    {...data}/>,
	shape:     (data: Partial<SvgOptions>) => <SVGShape      {...data}/>,
	sidebar:   (data: Partial<SvgOptions>) => <SVGSideBar    {...data}/>,
	text:      (data: Partial<SvgOptions>) => <SVGText       {...data}/>,
	default:   (data: Partial<SvgOptions>) => <SVGDefault    {...data}/>,
})

const SVGLoader = ({name, className, size, color}: SvgOptions) => {
	const data = { className, size, color };

	try {
		if(name === undefined)
			throw new Error();
		return icons[name](data);
	} catch {
		console.warn(`Svg icon "${name}" doesn't exist.\nPlease verify if the icon name is correct, or create the icon in SVGLoader.tsx`)
		return icons['default'](data);
	}
}
export default SVGLoader;
