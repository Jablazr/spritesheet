import {
  createSpritesheet,
  ISpritesheetOptions,
} from "./spritesheet/Spritesheet";
import { getResolvedImagePaths } from "./io/inputUtils";
import { writeSpritesheetFiles } from "./io/outputUtils";

const imagesDir = "images";
const spritesheetName = "spritesheet";
const outDir = imagesDir;
const options: ISpritesheetOptions = {
  atlasFormat: "pixijs",
};

const imagePaths = await getResolvedImagePaths(imagesDir);

const { atlas, image } = await createSpritesheet(imagePaths, options);

await writeSpritesheetFiles(outDir, spritesheetName, atlas, image);
