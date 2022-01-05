import { ISpriteFrame } from "../Packing";

export interface IAtlasData {}

export interface AtlasMaker<T extends IAtlasData> {
  makeAtlas(sprites: ISpriteFrame[]): T;
}
