import { sync as glob } from 'glob';
import { mkdirpSync, copySync } from 'fs-extra';
import { join, dirname } from 'path';

/** Function to copy files that match a glob to another directory. */
export function copyFiles(fromPath: string, fileGlob: string, outDir: string): void {
  glob(fileGlob, { cwd: fromPath }).forEach(filePath => {
    let fileDestPath = join(outDir, filePath);
    mkdirpSync(dirname(fileDestPath));
    copySync(join(fromPath, filePath), fileDestPath);
  });
}
