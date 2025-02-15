// plugins/example-backend/src/plugin.ts
import {
  coreServices,
  createBackendPlugin,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';
// import { MTAProvider } from '../../catalog-backend-module-mta/src/provider/MTAEntityProvider';

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { MTAProvider } from '../../catalog-backend-module-mta/src/provider/MTAEntityProvider';
// import { MTAProvider } from '@internal/plugin-catalog-backend-module-mta/src/provider/MTAEntityProvider';
// import { MTAProvider } from '@internal/plugin-catalog-backend-module-mta/src/provider/MTAEntityProvider';
// import { MTAProvider } from '@internal/plugin-catalog-backend-module-mta/src/provider/MTAEntityProvider';

import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import {
  cacheToPluginCacheManager,
  loggerToWinstonLogger,
} from '@backstage/backend-common';

export const mtaPlugin = createBackendPlugin({
  pluginId: 'mta',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        http: coreServices.httpRouter,
        config: coreServices.rootConfig,
        database: coreServices.database,
        identity: coreServices.identity,
        cache: coreServices.cache,
      },
      async init({ logger, http, config, database, identity, cache }) {
        logger.info('Hello from example plugin');
        const winstonLogger = loggerToWinstonLogger(logger);

        winstonLogger.info(`Url: ${config.getString('mta.url')}`);

        const pluginCacheManager = cacheToPluginCacheManager(cache);

        http.use(
          await createRouter({
            logger: winstonLogger,
            cache: pluginCacheManager,
            database,
            config,
            identity,
          }),
        );
      },
    });
  },
});
