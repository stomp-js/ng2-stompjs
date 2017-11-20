import { writeFileSync } from 'fs';
import { buildConfig } from './build-config';
import { join } from 'path';

/** Create a typing file that links to the bundled definitions of NGC. */
export function createTypingsReexportFile(outputDir: string, entryName: string): void {
  writeFileSync(join(outputDir, `${entryName}.d.ts`),
    buildConfig.licenseBanner + '\nexport * from "./typings/index";'
  );
}
