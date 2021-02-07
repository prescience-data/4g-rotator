import { env } from "./env"
import { RouterConfig } from "./types"

/**
 * Exports a configuration object with env and fallback defaults.
 * @type {RouterConfig}
 */
export const defaultConfig: RouterConfig = {
  secret: env.IP_RENEWAL_SECRET || "",
  to: env.IP_RENEWAL_EMAIL || "",
  priority: env.IP_RENEWAL_PRIORITY || "normal",
  device: undefined,
  payload: env.IP_RENEWAL_PAYLOAD || "renew",
  maxAttempts: env.IP_RENEWAL_MAX_ATTEMPTS || 3,
  delay: env.IP_RENEWAL_DELAY || 1000
}
