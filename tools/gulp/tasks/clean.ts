import { task } from 'gulp';
import { cleanTask } from '../util/task_helpers';
import { buildConfig, sequenceTask } from 'build-tools';


/** Deletes the dist/ directory. */
task('clean', cleanTask(buildConfig.outputDir));

/** Deletes the doc/ directory. */
task('clean:docs', cleanTask(buildConfig.docsDir));

/** Deletes the doc/ and dist/ directories. */
task('clean:all',
  sequenceTask('clean', 'clean:docs')
);
