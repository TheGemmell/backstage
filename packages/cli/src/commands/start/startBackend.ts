/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from 'fs-extra';
import { paths } from '../../lib/paths';
import { startBackendExperimental } from '../../lib/experimental/startBackendExperimental';

interface StartBackendOptions {
  checksEnabled: boolean;
  inspectEnabled: boolean;
  inspectBrkEnabled: boolean;
  require?: string;
}

export async function startBackend(options: StartBackendOptions) {
  const waitForExit = await startBackendExperimental({
    entry: 'src/index',
    checksEnabled: false, // not supported
    inspectEnabled: options.inspectEnabled,
    inspectBrkEnabled: options.inspectBrkEnabled,
    require: options.require,
  });

  await waitForExit();
}

export async function startBackendPlugin(options: StartBackendOptions) {
  const hasDevIndexEntry = await fs.pathExists(
    paths.resolveTarget('dev', 'index.ts'),
  );
  if (!hasDevIndexEntry) {
    console.warn(
      `The 'dev' directory is missing. Please create a proper dev/index.ts in order to start the plugin.`,
    );
    return;
  }

  const waitForExit = await startBackendExperimental({
    entry: 'dev/index',
    checksEnabled: false, // not supported
    inspectEnabled: options.inspectEnabled,
    inspectBrkEnabled: options.inspectBrkEnabled,
    require: options.require,
  });

  await waitForExit();
}
