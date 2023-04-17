import HttpServer from './api/HttpServer';
import config from './configuration/config';
import Logger from './utils/Logger';

async function main(): Promise<void> {
  const server = new HttpServer({ ...config, prefix: '/api' });
  const logger = new Logger('Main');

  server.connect();

  server.on('ready', (): void => {
    logger.ready(`${config.name} (${config.url}) is initialized and fully operational.`);
  });

  server.on('debug', (message: string): void => {
    logger.info(message);
  });
}

main();
