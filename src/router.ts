import EventEmitter from "events"

import { getIpData, toggleFlightMode } from "./api"
import { RenewalFailedError } from "./errors"
import { IpHistorySchema, RouterConfigSchema } from "./schemas"
import {
  IpHistory,
  PartialRouterConfig,
  RenewableRouter,
  RouterConfig
} from "./types"
import { debug, getLastIp, hasConnection, waitForTimeout } from "./utils"

/**
 * Renewable 4G Router
 *
 * @class
 * @classdesc Renews an IP address on a device connected with Automate.
 * @extends {EventEmitter}
 * @implements {RenewableRouter}
 */
export class Router extends EventEmitter implements RenewableRouter {
  /**
   * Tracks the successful renewals.
   * @type {Set<IpHistory>}
   * @protected
   */
  protected readonly _history: Set<IpHistory>

  /**
   * Tracks the current session renewals.
   * Is cleared at the end of each session.
   *
   * @type {Set<IpHistory>}
   * @protected
   */
  protected readonly _cache: Set<IpHistory>

  /**
   * Defines some basic configuration using env file or passed in object.
   * @type {RouterConfig}
   * @protected
   */
  protected readonly _config: RouterConfig

  /**
   * Constructor
   * Accepts an optional configuration if not using env file.
   *
   * @param {PartialRouterConfig} config
   */
  public constructor(config?: PartialRouterConfig) {
    super()
    debug(`Constructing router.`)
    // Parse config.
    this._config = RouterConfigSchema.parse(config)
    // Init history.
    this._history = new Set<IpHistory>()
    this._cache = new Set<IpHistory>()
    debug(`Router constructed.`)
  }

  /**
   * Readonly accessor for current ip address.
   *
   * @return {string | undefined}
   */
  public get ip(): string | undefined {
    return getLastIp(this._history)
  }

  /**
   * Readonly accessor to show current renewal attempts.
   *
   * @return {number}
   */
  public get attempts(): number {
    return this._cache.size
  }

  /**
   * Allow users to observe last cached public ip.
   *
   * @return {string | undefined}
   */
  public get lastCachedIp(): string | undefined {
    return getLastIp(this._cache)
  }

  /**
   * Public readonly accessor for history as array.
   *
   * @return {IpHistory[]}
   */
  public get history(): IpHistory[] {
    return [...(this._history.values() || [])]
  }

  /**
   * Inform user when a new ip has been obtained or drop if dirty address.
   *
   * @return {boolean}
   */
  public validateIp(data: IpHistory | undefined): boolean {
    // Drop if no response.
    if (!data) {
      return false
    }
    // Loop over threat detections.
    for (const [key, value] of Object.entries(data.threat || {})) {
      if (value) {
        debug(`IP flagged as "${key}"! Rejecting.`)
        return false
      }
    }
    // Check if ip already used.
    return data.ip !== this.lastCachedIp
  }

  /**
   * Return the module to a clean state.
   *
   * @return {Promise<void>}
   */
  public async init(): Promise<void> {
    debug(`Initialising router.`)
    const record: IpHistory = await this.lookup()
    this._history.add(record)
    this._cache.add(record)
    this.emit("init")
    debug(`Initialisation complete.`)
  }

  /**
   * Connects to the IPData API and checks the current public ip.
   *
   * @return {Promise<IpHistory>}
   */
  public async lookup(): Promise<IpHistory> {
    debug(`Attempting lookup of public IP address.`)
    const { key, fields } = this._config.ipdata
    return {
      ...(await getIpData({ key, fields })),
      ...{ timestamp: Date.now() }
    }
  }

  /**
   * Primary entry point that triggers the renewal.
   *
   * @return {Promise<boolean>}
   */
  public async renew(): Promise<boolean> {
    // Reset the module to a known state.
    debug(`Starting IP renewal cycle.`)
    await this.init()
    // Destructure config items.
    const {
      maxAttempts,
      delay,
      secret,
      to,
      payload,
      device,
      priority
    } = this._config
    // Set initial ip to invalid state.
    let ip: IpHistory | undefined = undefined
    let hasToggled: boolean = false
    // Attempt renewals until a new IP is obtained, or hits max attempts.
    debug(`Attempting renewal with a maximum of ${maxAttempts} attempts.`)
    while (!this.validateIp(ip) && this.attempts < maxAttempts) {
      if (!hasToggled) {
        // Send payload to Automate to trigger the flow on the device.
        debug(`Attempting to toggle flight mode remotely.`)
        await toggleFlightMode({ secret, to, payload, device, priority })
        hasToggled = true
      }
      // Only attempt an ip check if device has connectivity.
      if (await hasConnection()) {
        debug(`Interface has connectivity!`)
        // Check host's  public ip address.
        ip = IpHistorySchema.parse(await this.lookup())
        debug(`Reflected IP context: `, ip)
        // Add the current public ip to cache.
        this._cache.add(ip)
        // If new IP is different to last ip, return a success response.
        if (this.validateIp(ip)) {
          // Add to the history set to register new public ip.
          this._history.add(ip)
          this.emit("success", ip)
          return true
        } else {
          // Received invalid IP, try for a new IP.
          this._cache.clear()
          hasToggled = false
        }
      }
      // Wait for a specified delay between connection checks.
      debug(`Connection not online, waiting ${delay} ms.`)
      await waitForTimeout(delay)
    }
    // Renewal process failed, return a negative response.
    this._cache.clear()
    debug(`Exceeded maximum attempts of ${maxAttempts}.`)
    this.emit("error", new RenewalFailedError(maxAttempts))
    return false
  }
}
