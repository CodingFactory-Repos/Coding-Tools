import { GeometryTypes } from './pixi-enums';

export interface GeometryRequest{
    type : GeometryTypes,
}

export interface NormalizedObject {
    graphic: GeometryRequest["type"],
    x:number,
    y:number,
    width:number,
    height:number,
    color:number,
    alpha:number,
    rotation:number,
    scaleX:number, //TODO System of Scaling, Christopher need to change it 
    scaleY:number, //TODO System of Scaling, Christopher need to change it 
    scaleZ:number, //TODO System of Scaling, Christopher need to change it 
    texture:number // If u want to use texture
  }