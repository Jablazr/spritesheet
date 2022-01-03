import pack from "bin-pack";
import { IProcessedImage } from "./ProcessImages";

export interface ISpriteFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  sprite: any;
}

export const packImages = (images: IProcessedImage[]) => {
  const { items, width, height } = pack(images);

  const sprites = items.reduce(
    (sprites, item) => [
      {
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
        sprite: item.item,
      },
      ...sprites,
    ],
    <ISpriteFrame[]>[]
  );

  return { sprites, width, height };
};
