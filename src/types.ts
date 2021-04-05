import EventEmitter from "events"
import { z } from "zod"

import {
  AutomatePayloadSchema,
  EnvSchema,
  IpDataConfigSchema,
  IpDataFieldsSchema,
  IpDataResponseSchema,
  IpHistorySchema,
  PartialRouterConfigSchema,
  RenewalPrioritySchema,
  RouterConfigSchema
} from "./schemas"

// Export the shapes of each zod schema.
export type RouterEnv = z.infer<typeof EnvSchema>
export type RenewalPriority = z.infer<typeof RenewalPrioritySchema>
export type AutomatePayload = z.infer<typeof AutomatePayloadSchema>
export type RouterConfig = z.infer<typeof RouterConfigSchema>
export type IpHistory = z.infer<typeof IpHistorySchema>
export type IpDataConfig = z.infer<typeof IpDataConfigSchema>
export type IpDataFields = z.infer<typeof IpDataFieldsSchema>
export type IpDataResponse = z.infer<typeof IpDataResponseSchema>

// Note: Must use z.input for partials.
export type PartialRouterConfig = z.input<typeof PartialRouterConfigSchema>

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
