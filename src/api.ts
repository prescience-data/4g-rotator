import got from "got"
import { URL } from "url"

import { AUTOMATE_SERVER_URL, IPDATA_SERVER_URL } from "./constants"
import { env } from "./schemas"
import { AutomatePayload, IpDataConfig, IpDataResponse } from "./types"
import { debug, waitForTimeout } from "./utils"

/**
 * Sends a request to the Automate endpoint to execute the installed Flow.
 *
 * @param {AutomatePayload} json
 * @param {number} delay
 * @return {Promise<void>}
 */
export const toggleFlightMode = async (
  json: AutomatePayload,
  delay: number = env.TOGGLE_DELAY
): Promise<void> => {
  try {
    // Post the toggle request to the Automate server.
    debug(`Dispatching payload to Automate app: `, json)
    await got.post(AUTOMATE_SERVER_URL, { json })
  } catch (err) {
    console.log(err.message)
  }
  // Give the device time to reconnect.
  await waitForTimeout(delay)
}

/**
 * Retrieves the IPData response from the api.
 *
 * @param {IpDataConfig} config
 * @return {Promise<IpDataResponse>}
 */
export const getIpData = async ({
  key,
  fields
}: IpDataConfig): Promise<IpDataResponse> => {
  const url: URL = new URL(IPDATA_SERVER_URL)
  url.searchParams.append("api-key", key)
  url.searchParams.append("fields", fields.join(","))
  debug(`Sending request to IPData: `, url.toString())
  const { body, statusCode, statusMessage } = await got.get<IpDataResponse>(
    url.toString(),
    {
      responseType: "json"
    }
  )
  debug(`Received payload!`)
  return { ...body, ...{ statusCode, statusMessage } }
}
