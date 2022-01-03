import { basename } from "path";
import { ISpriteFrame } from "./Packing";

export namespace PixiJS {
  export interface ISpritesheetFrameData {
    frame: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
    trimmed?: boolean;
    rotated?: boolean;
    sourceSize?: {
      w: number;
      h: number;
    };
    spriteSourceSize?: {
      x: number;
      y: number;
    };
    anchor?: {
      x: number;
      y: number;
    };
  }

  export interface ISpritesheetData {
    frames: { [key: string]: ISpritesheetFrameData };
    animations?: { [key: string]: string[] };
    meta: {
      scale: string;
    };
  }

  export const createAtlas = (sprites: ISpriteFrame[]): ISpritesheetData => {
    const frames = sprites
      .sort((a, b) =>
        basename(a.sprite.image.src.toString()).localeCompare(
          basename(b.sprite.image.src.toString())
        )
      )
      .reduce((frames, { x, y, width, height, sprite: imageData }) => {
        const name = basename(imageData.image.src.toString());

        frames[name] = {
          frame: {
            x: x,
            y: y,
            w: width,
            h: height,
          },
          rotated: false,
          trimmed: Object.values(imageData.cropped).some(
            (value) => <number>value > 0
          ),
          spriteSourceSize: {
            x: imageData.cropped.left,
            y: imageData.cropped.top,
          },
          sourceSize: {
            w: imageData.image.width,
            h: imageData.image.height,
          },
        };
        return frames;
      }, <{ [key: string]: PixiJS.ISpritesheetFrameData }>{});

    return {
      meta: {
        scale: "1",
      },
      frames: frames,
    };
  };
}
