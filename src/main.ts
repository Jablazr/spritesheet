import spritesheet from "./spritesheet.js";
import { readdir, access, mkdir, writeFile } from "fs/promises";
import { join, resolve, extname } from "path";

const supportedExtensions = [".png", ".jpg", ".jpeg"];

const options = {
  name: "spritesheet",
  crop: true,
  margin: 1,
  format: "png",
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

const { json, image } = await spritesheet(fileNames, options);

try {
  await access(outDir);
} catch {
  await mkdir(outDir);
}

await writeFile(join(outDir, `${options.name}.${options.format}`), image);

await writeFile(
  join(outDir, `${options.name}.json`),
  JSON.stringify(json, undefined, 2)
);
