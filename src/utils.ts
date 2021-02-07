import got from "got"
import isOnline from "is-online"

import { AutomatePayload } from "./types"

/**
 * Pauses for a specified duration.
 *
 * @param {number} ms
 * @return {Promise<void>}
 */
export const waitFor = async (ms: number): Promise<void> => {
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
  maxAttempts: number = 5
): Promise<boolean> => {
  let hasConnection: boolean = false
  let attempt: number = 0
  while (!hasConnection && attempt < maxAttempts) {
    await waitFor(2500)
    hasConnection = await isOnline()
    attempt++
  }
  return hasConnection
}

/**
 * Sends a request to the Automate endpoint to execute the installed Flow.
 *
 * @param {AutomatePayload} params
 * @param {number} delay
 * @return {Promise<void>}
 */
export const toggleFlightMode = async (
  params: AutomatePayload,
  delay: number = 15000
): Promise<void> => {
  await got.post("https://llamalab.com/automate/cloud/message", {
    json: params,
    responseType: "json"
  })
  // Give the device time to reconnect.
  await waitFor(delay)
}
