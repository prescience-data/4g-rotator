import EventEmitter from "events"
import { z } from "zod"

import * as Schemas from "./schemas"

// Export the shapes of each zod schema.
export type RouterEnv = z.infer<typeof Schemas.EnvSchema>
export type RenewalPriority = z.infer<typeof Schemas.RenewalPrioritySchema>
export type AutomatePayload = z.infer<typeof Schemas.AutomatePayloadSchema>
export type RouterConfig = z.infer<typeof Schemas.RouterConfigSchema>
export type IpHistory = z.infer<typeof Schemas.IpHistorySchema>
export type IpDataConfig = z.infer<typeof Schemas.IpDataConfigSchema>
export type IpDataFields = z.infer<typeof Schemas.IpDataFieldsSchema>
export type IpDataResponse = z.infer<typeof Schemas.IpDataResponseSchema>
export type PartialRouterConfig = z.input<
  typeof Schemas.PartialRouterConfigSchema
>

// Export one-shot function type.
export type RenewIp = (config: PartialRouterConfig) => Promise<boolean>

// Export the base router shape.
export interface RenewableRouter extends EventEmitter {
  readonly ip: string | undefined
  readonly lastCachedIp: string | undefined
  readonly attempts: number
  readonly history: IpHistory[]

  init(): Promise<void>

  renew(): Promise<boolean>

  validateIp(ip: IpHistory | undefined): boolean
}
