import cropping from "detect-edges";
import pack from "bin-pack";
import { basename } from "path";

import Canvas from "canvas";
const { createCanvas, loadImage } = Canvas;

export interface IOptions {
  crop: boolean;
  margin: number;
}

/**
 * Represents the JSON data for a spritesheet atlas.
 */
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

/**
 * Atlas format.
 */
export interface ISpritesheetData {
  frames: { [key: string]: ISpritesheetFrameData };
  animations?: { [key: string]: string[] };
  meta: {
    scale: string;
  };
}

interface ICroppedImage {
  width: number;
  height: number;
  image: Canvas.Image;
  cropped: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

const defaultOptions: IOptions = {
  crop: true,
  margin: 1,
};

export const createSpritesheet = async (
  imagePaths: string[],
  options: IOptions
): Promise<{ atlas: ISpritesheetData; image: Buffer }> => {
  const { margin, crop } = {
    ...defaultOptions,
    ...options,
  };

  // Load all images
  const images = await Promise.all(
    imagePaths.map(async (path) => await loadImage(path))
  );

  // Crop all images
  const croppedImages: ICroppedImage[] = await Promise.all(
    images.map(async (image) => {
      const { width, height } = image;

      const cropCanvas = createCanvas(width, height);
      const cropCanvasCtx = cropCanvas.getContext("2d");

      cropCanvasCtx.drawImage(image, 0, 0);

      const cropped = crop
        ? await cropping(cropCanvas)
        : {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          };

      return {
        width: width - cropped.left - cropped.right + margin,
        height: height - cropped.top - cropped.bottom + margin,
        image,
        cropped,
      };
    })
  );

  // Pack images
  const { items, width, height } = pack(croppedImages);

  const canvas = createCanvas(width + margin, height + margin);
  const context = canvas.getContext("2d");

  // Draw all images on the destination canvas
  items.forEach(({ x, y, item }) => {
    context.drawImage(
      item.image,
      x - item.cropped.left + margin,
      y - item.cropped.top + margin
    );
  });

  const frames = items
    .sort((a, b) =>
      basename(a.item.image.src.toString()).localeCompare(
        basename(b.item.image.src.toString())
      )
    )
    .reduce((frames, { x, y, width, height, item: imageData }) => {
      const name = basename(imageData.image.src.toString());

      frames[name] = {
        frame: {
          x: x + margin,
          y: y + margin,
          w: width - margin,
          h: height - margin,
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
    }, <{ [key: string]: ISpritesheetFrameData }>{});

  const atlas: ISpritesheetData = {
    meta: {
      scale: "1",
    },
    frames: frames,
  };

  // Write image
  const image = await new Promise((resolve, reject) => {
    canvas.toBuffer((error, buffer) => {
      if (error) reject(error);

      resolve(buffer);
    });
  });

  return {
    atlas,
    image: image as Buffer,
  };
};
