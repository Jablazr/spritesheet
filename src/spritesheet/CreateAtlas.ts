import { Atlas } from "./atlas_format/Atlas";
import { ISpriteFrame } from "./Packing";

export const createAtlas = (format: string, sprites: ISpriteFrame[]) => {
  const atlasMaker = Atlas.getFormat(format);

  return atlasMaker.makeAtlas(sprites);
};
