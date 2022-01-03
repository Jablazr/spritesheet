import { createSpritesheet } from "./spritesheet/Spritesheet";
import { getResolvedImagePaths } from "./io/inputUtils";
import { writeSpritesheetFiles } from "./io/outputUtils";

const imagesDir = "images";
const spritesheetName = "spritesheet";
const outDir = imagesDir;

const imagePaths = await getResolvedImagePaths(imagesDir);

const { atlas, image } = await createSpritesheet(imagePaths);

await writeSpritesheetFiles(outDir, spritesheetName, atlas, image);
