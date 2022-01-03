import { PixiJS } from "./AtlasFormat";
import { ISpriteFrame } from "./Packing";

export const createAtlas = (format: string, sprites: ISpriteFrame[]) => {
  if (format === "pixijs") {
    return PixiJS.createAtlas(sprites);
  }

  return PixiJS.createAtlas(sprites);
};
