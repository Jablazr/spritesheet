import cropping from "detect-edges";
import pack from "bin-pack";
import { basename } from "path";

import Canvas from "canvas";
const { createCanvas, loadImage } = Canvas;

const defaultOptions = {
  format: "png",
  margin: 1,
  crop: true,
  name: "spritesheet",
};

export default async (
  paths: Array<string>,
  options: {}
): Promise<{ json: object; image: Buffer }> => {
  const { format, margin, crop, name } = {
    ...defaultOptions,
    ...options,
  };

  // Check input path
  if (!paths || !paths.length) {
    throw new Error("No file given.");
  }

  // Check outputFormat
  const supportedFormat = ["png", "jpeg"];
  if (!supportedFormat.includes(format)) {
    const supported = JSON.stringify(supportedFormat);
    throw new Error(
      `outputFormat should only be one of ${supported}, but "${format}" was given.`
    );
  }

  // Load all images
  const loads = paths.map((path) => loadImage(path));
  const images = await Promise.all(loads);

  const playground = createCanvas(0, 0);
  const playgroundContext = playground.getContext("2d");

  // Crop all image
  const data = await Promise.all(
    images.map(async (source) => {
      const { width, height } = source;
      playground.width = width;
      playground.height = height;
      playgroundContext.drawImage(source, 0, 0);

      const cropped = crop
        ? await cropping(playground)
        : {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          };
      return {
        width: width - cropped.left - cropped.right + margin,
        height: height - cropped.top - cropped.bottom + margin,
        source,
        cropped,
      };
    })
  );

  // Pack images
  const { items, width, height } = pack(data);

  const canvas = createCanvas(width + margin, height + margin);
  const context = canvas.getContext("2d");

  // Draw all images on the destination canvas
  items.forEach(({ x, y, item }) => {
    context.drawImage(
      item.source,
      x - item.cropped.left + margin,
      y - item.cropped.top + margin
    );
  });

  items
    .sort((a, b) =>
      basename(a.item.source.src.toString()).localeCompare(
        basename(b.item.source.src.toString())
      )
    )
    .reduce((images, { x, y, width, height, item: imageData }) => {
      images[basename(imageData.source.src.toString())] = {
        // Position and size in the spritesheet
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
        // Relative position and size of the content
        spriteSourceSize: {
          x: imageData.cropped.left,
          y: imageData.cropped.top,
          w: width - margin,
          h: height - margin,
        },
        // File image sizes
        sourceSize: {
          w: imageData.source.width,
          h: imageData.source.height,
        },
      };
      return images;
    }, <{ [key: string]: any }>{});

  const json = {
    meta: {
      app: "pencil.js/spritesheet",
      version: "1.0.0",
      image: `${name}.${format}`,
      size: {
        w: width,
        h: height,
      },
      scale: 1,
    },
    frames: items,
  };

  // Write image
  const image = await new Promise((resolve, reject) => {
    canvas.toBuffer((error, buffer) => {
      if (error) reject(error);

      resolve(buffer);
    });
  });

  return {
    json,
    image: image as Buffer,
  };
};
