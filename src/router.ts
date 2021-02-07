import EventEmitter from "events"
import { v4 as getPublicIp } from "public-ip"

import { defaultConfig } from "./config"
import { IpHistory, RenewableRouter, RouterConfig } from "./types"
import { hasConnection, toggleFlightMode, waitFor } from "./utils"

/**
 * @class Router
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
   * @param {RouterConfig} config
   */
  public constructor(config?: RouterConfig) {
    super()
    this._config = config || defaultConfig
    this._history = new Set<IpHistory>()
    this._cache = new Set<IpHistory>()
  }

  /**
   * Readonly accessor for current ip address.
   *
   * @return {string | undefined}
   */
  public get ip(): string | undefined {
    const record: IpHistory | undefined = Array.from(
      this._history.values() || []
    ).pop()
    return record ? record.ip : undefined
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
    const record: IpHistory | undefined = Array.from(
      this._cache.values() || []
    ).pop()
    return record ? record.ip : undefined
  }

  /**
   * Public readonly accessor for history as array.
   *
   * @return {IpHistory[]}
   */
  public get history(): IpHistory[] {
    return Array.from(this._history.values() || [])
  }

  /**
   * Inform user when a new ip has been obtained.
   *
   * @return {boolean}
   */
  public hasNewIp(): boolean {
    return this.ip !== this.lastCachedIp
  }

  /**
   * Return the module to a clean state.
   *
   * @return {Promise<void>}
   */
  public async init(): Promise<void> {
    const record: IpHistory = {
      ip: await getPublicIp(),
      timestamp: Date.now()
    }
    this._history.add(record)
    this._cache.add(record)
    this.emit("init")
  }

  /**
   * Primary entry point that triggers the renewal.
   *
   * @return {Promise<boolean>}
   */
  public async renew(): Promise<boolean> {
    // Reset the module to a known state.
    await this.init()
    // Attempt renewals until a new IP is obtained, or hits max attempts.
    while (!this.hasNewIp() && this.attempts < this._config.maxAttempts) {
      // Send payload to Automate to trigger the flow on the device.
      const { secret, to, payload, device, priority } = this._config
      await toggleFlightMode({ secret, to, payload, device, priority })
      // Only attempt an ip check if device has connectivity.
      if (await hasConnection()) {
        // Check host's  public ip address.
        const ip: IpHistory = {
          ip: await getPublicIp(),
          timestamp: Date.now()
        }
        // Add the current public ip to cache.
        this._cache.add(ip)
        // If new IP is different to last ip, return a success response.
        if (this.hasNewIp()) {
          // Add to the history set to register new public ip.
          this._history.add(ip)
          this.emit("success", ip)
          return true
        }
      }
      // Wait for a specified delay between connection checks.
      await waitFor(this._config.delay)
    }
    // Renewal process failed, return a negative response.
    this._cache.clear()
    this.emit("error", new Error(`Could not obtain a new IP address.`))
    return false
  }
}
