import { Router } from "./router"
import { PartialRouterConfig, RenewIp } from "./types"

/**
 * Factory interface which creates new renewal router and returns the renewal function.
 *
 * @param {PartialRouterConfig} config
 * @return {RenewIp}
 */
export const useRouter = (config: PartialRouterConfig): RenewIp =>
  new Router(config).renew
