import { debug as debugFactory, Debugger } from "debug"
import isOnline from "is-online"

import { env } from "./schemas"
import { IpHistory } from "./types"

/**
 * Export a debug module for the package.
 * @type {debug.Debugger}
 */
export const debug: Debugger = debugFactory("renew-ip")

/**
 * Pauses for a specified duration.
 *
 * @param {number} ms
 * @return {Promise<void>}
 */
export const waitForTimeout = async (ms: number): Promise<void> => {
  debug(`Waiting for timeout after ${ms}ms.`)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

/**
 * Slower devices can take a while to reconnect, so loop to try get a connection.
 *
 * @param {number} maxAttempts
 * @return {Promise<boolean>}
 */
export const hasConnection = async (
  maxAttempts: number = env.POLL_ATTEMPTS
): Promise<boolean> => {
  let hasConnection: boolean = false
  let attempt: number = 0
  while (!hasConnection && attempt < maxAttempts) {
    debug(`Polling for connectivity. Attempt #${attempt}...`)
    await waitForTimeout(env.POLL_TIMEOUT)
    hasConnection = await isOnline()
    attempt++
  }
  debug(`Connectivity after ${attempt} attempts:`, hasConnection)
  return hasConnection
}

/**
 * Pops the last ip history from a history set and attempts to return the ip attribute.
 *
 * @param {Set<IpHistory>} history
 * @return {string | undefined}
 */
export const getLastIp = (history: Set<IpHistory>): string | undefined => {
  return [...(history.values() || [])].pop()?.ip
}
