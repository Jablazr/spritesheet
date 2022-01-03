import Canvas from "canvas";
import { createAtlas } from "./CreateAtlas";
import { createSpritesheetImage } from "./CreateSpritesheetImage";
import { packImages } from "./Packing";
import { processImages } from "./ProcessImages";
const { loadImage } = Canvas;

export const createSpritesheet = async (
  imagePaths: string[]
): Promise<{ atlas: object; image: Buffer }> => {
  const images = await Promise.all(
    imagePaths.map(async (path) => await loadImage(path))
  );

  const processedImages = await processImages(images);

  const { sprites, width, height } = packImages(processedImages);

  const image = await createSpritesheetImage(sprites, width, height);

  const atlas = createAtlas("pixijs", sprites);

  return {
    atlas,
    image: image as Buffer,
  };
};
