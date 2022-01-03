import { readdir } from "fs/promises";
import { extname, resolve, join } from "path";

const supportedExtensions = [".png", ".jpg", ".jpeg"];

export const getResolvedImagePaths = async (imagesDir: string) => {
  imagesDir = resolve(imagesDir);

  return (await readdir(imagesDir))
    .filter((imagePath) => {
      return supportedExtensions.includes(extname(imagePath).toLowerCase());
    })
    .map((imagePath) => {
      return join(imagesDir, imagePath);
    });
};
