import EventEmitter from 'node:events';
import Express, { type Application } from 'express';
import { IHttpServerOptions } from 'src/types/global.interface';

class HttpServer extends EventEmitter {
  private app: Application = Express();
  public options: IHttpServerOptions;

  constructor(options: IHttpServerOptions) {
    super();

    /**
     * Set the options
     */
    this.options = options;
  }

  /**
   * Get the express application
   */
  public get application(): Application {
    return this.app;
  }

  /**
   * Start the server
   */
  public connect(): void {
    this.app.listen(this.options.port, (): void => {
      this.emit('debug', `Back-end service is listening to port ${this.options.port}...`);
      this.emit('ready');
    });
  }
}

export default HttpServer;
