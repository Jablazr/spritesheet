import { AtlasMaker, IAtlasData } from "./AtlasMaker";
import { PixiJSAtlasMaker } from "./formats/Pixijs";

export class Atlas {
  static getFormat = (format: string): AtlasMaker<IAtlasData> => {
    if (format === "pixijs") {
      return new PixiJSAtlasMaker();
    }

    return new PixiJSAtlasMaker();
  };
}
