import { createPackageBuildTasks } from 'build-tools';

// Create gulp tasks to build the different packages in the project.
createPackageBuildTasks();

import './tasks/clean';
import './tasks/default';
