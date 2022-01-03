import Canvas from "canvas";
import { ISpriteFrame } from "./Packing";

const { createCanvas } = Canvas;

export const createSpritesheetImage = async (
  sprites: ISpriteFrame[],
  width: number,
  height: number
) => {
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  sprites.forEach(({ x, y, sprite }) => {
    context.drawImage(
      sprite.image,
      x - sprite.cropped.left,
      y - sprite.cropped.top
    );
  });

  const image = await new Promise((resolve, reject) => {
    canvas.toBuffer((error, buffer) => {
      if (error) reject(error);

      resolve(buffer);
    });
  });

  return image;
};
