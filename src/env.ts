import dotenv from "dotenv"

import { RouterEnv } from "./types"

/**
 * Exports a typed env file.
 * @type {RouterEnv}
 */
export const env: RouterEnv = dotenv.config().parsed || {}
