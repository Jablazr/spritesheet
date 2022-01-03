import { access, mkdir, writeFile } from "fs/promises";
import { join, resolve } from "path";

export const writeSpritesheetFiles = async (
  outDir: string,
  spritesheetName: string,
  atlas: object,
  image: Buffer
) => {
  outDir = resolve(join(outDir, spritesheetName));

  try {
    await access(outDir);
  } catch {
    await mkdir(outDir);
  }

  await writeFile(join(outDir, `${spritesheetName}.png`), image);

  await writeFile(
    join(outDir, `${spritesheetName}.json`),
    JSON.stringify(atlas, undefined, 2)
  );
};
