import { task, watch, src, dest } from 'gulp';
import { join } from 'path';
import { main as tsc } from '@angular/tsc-wrapped';
import { buildConfig } from '../build-config';
import { composeRelease } from '../build-release';
import { buildPackageBundles } from '../build-bundles';
import { sequenceTask } from './sequence-task';

const { packagesDir, outputDir } = buildConfig;
const packageName = 'ng2-stompjs';

export function createPackageBuildTasks(): void {
  // To avoid refactoring of the project the package ng2-stompjs will map to the source path `lib/`.
  const packageRoot = join(packagesDir);
  const packageOut = join(outputDir, 'packages', packageName);
  const tsconfigBuild = join(packageRoot, 'tsconfig-build.json');
  // Paths to the different output files and directories.
  const esmMainFile = join(packageOut, 'index.js');

  /**
   * Main tasks for the package building. Tasks execute the different sub-tasks in the correct
   * order.
   */
  task(`${packageName}:clean-build`, sequenceTask('clean', `${packageName}:build`));

  task(`${packageName}:build`, sequenceTask(
    // Build ESM and assets output.
    `${packageName}:build:esm`,
    // Build bundles on top of inlined ESM output.
    `${packageName}:build:bundles`
  ));

  /**
   * Release tasks for the package. Tasks compose the release output for the package.
   */
  task(`${packageName}:build-release:clean`, sequenceTask('clean', `${packageName}:build-release`));
  task(`${packageName}:build-release`, [`${packageName}:build`], () => composeRelease(packageName));

  /**
   * TypeScript compilation tasks. Tasks are creating ESM, FESM, UMD bundles for releases.
   */
  task(`${packageName}:build:esm`, () => tsc(tsconfigBuild, { basePath: packageRoot }));

  task(`${packageName}:build:bundles`, () => buildPackageBundles(esmMainFile, packageName));
}
