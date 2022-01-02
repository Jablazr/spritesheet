import { IOptions, createSpritesheet } from "./Spritesheet";
import { readdir, access, mkdir, writeFile } from "fs/promises";
import { join, resolve, extname } from "path";

const supportedExtensions = [".png", ".jpg", ".jpeg"];

const options: IOptions = {
  crop: true,
  margin: 1,
};

const imagesDir = join(resolve(), "images");
const outDir = join(imagesDir, "out");

// get files with supported extensions
const fileNames = (await readdir(imagesDir))
  .filter((name) => {
    return supportedExtensions.includes(extname(name).toLowerCase());
  })
  .map((name) => {
    return join(imagesDir, name);
  });

const { atlas, image } = await createSpritesheet(fileNames, options);

try {
  await access(outDir);
} catch {
  await mkdir(outDir);
}

await writeFile(join(outDir, "spritesheet.png"), image);

await writeFile(
  join(outDir, "spritesheet.json"),
  JSON.stringify(atlas, undefined, 2)
);
