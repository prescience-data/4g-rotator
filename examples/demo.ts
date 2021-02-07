import { RenewableRouter, Router } from "../src"

/**
 * @class Demonstration
 * @class An abstract demo of how to implement the package. Note that in practice you would import from `renew-ip` not `../src`.
 */
export class Demo {
  /**
   * Protected container for the router.
   * @type {RenewableRouter}
   * @protected
   */
  protected _router: RenewableRouter = new Router()

  /**
   * Public method to toggle the handset's ip.
   *
   * @return {Promise<boolean>}
   */
  public async renewIp(): Promise<boolean> {
    return await this._router.renew()
  }

  /**
   * Example method for executing a web scrape with a fresh IP.
   *
   * @param {string} url
   * @return {Promise<void>}
   */
  public async scrape(url: string): Promise<void> {
    // Only continue if a fresh IP is obtained.
    if (await this.renewIp()) {
      // ... some sort of scrape task for example...
    } else {
      throw new Error(`Could not get a fresh ip, aborting scrape.`)
    }
  }
}
