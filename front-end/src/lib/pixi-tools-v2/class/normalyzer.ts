import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { Scene } from '../scene';
import { GeometryRequest, NormalizedObject } from '@/lib/pixi-tools-v2/types/pixi-container-options';
import { GeometryTypes } from '@/lib/pixi-tools-v2/types/pixi-enums'
import { Stage} from '@/lib/pixi-tools-v2/types/pixi-type-aliases';


export class Normalizer {
    /**
     * The stage to which this PixiObject belongs.
     * @private
     */
    private readonly _stage: Stage;

    /**
     * The viewport to which this PixiObject belongs.
     * @private
     */
    private readonly _viewport: Viewport;

    constructor(stage: Stage, viewport: Viewport) {
        this._stage = stage;
        this._viewport = viewport;
    }

    watchdogGraphics(object: NormalizedObject[]): { scene: Stage, viewport: Viewport, Geometry: NormalizedObject } {

        const normalizedObj: NormalizedObject[] = [];

        for (let i = 0; i < object.length; i++) {
            const obj = object[i];
            normalizedObj[i] = this.normalizeObject(obj);
            switch (obj.graphic.toString()) {
                case "RECTANGLE":
                    normalizedObj[i].graphic = obj.graphic;
                    break;
                case "ELLIPSE":
                    normalizedObj[i].graphic = obj.graphic;
                    break;
                case "CIRCLE":
                    normalizedObj[i].graphic = obj.graphic;
                    break
                case "POLYGON":
                    normalizedObj[i].graphic = obj.graphic;
                    break;
                case "POLYLINE":
                    normalizedObj[i].graphic = obj.graphic;
                    break;
                case "TEXTINPUT":
                    normalizedObj[i].graphic = obj.graphic;
                    break;
                default:
                    throw new Error("Unknown Object Type : " + normalizedObj[i].constructor);
            }
        }
        return {
            scene: this._stage,
            viewport: this._viewport,
            Geometry: normalizedObj
        }
    }

    private normalizeObject(object: NormalizedObject) {
        const type = object.graphic;
        //TODO Faire un initialisateur d'objet NormalizedObject
        let obj = {
            graphic: GeometryTypes[type.toString()],
            x: 0.0,
            y: 0,
            width: 0,
            height: 0,
            color: 0,
            alpha: 0,
            rotation: 0,
            scaleX: 0, //TODO System of Scaling, Christopher need to change it 
            scaleY: 0, //TODO System of Scaling, Christopher need to change it 
            scaleZ: 0, //TODO System of Scaling, Christopher need to change it 
            texture: 0 // If u want to use texture
        }
        object = obj;
        return object;
    }
}