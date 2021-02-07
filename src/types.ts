import EventEmitter from "events"

export interface IpHistory {
  ip: string
  timestamp: number
}

export interface RouterEnv extends Record<string, unknown> {
  IP_RENEWAL_SECRET?: string
  IP_RENEWAL_EMAIL?: string
  IP_RENEWAL_PRIORITY?: "normal" | "high" | string
  IP_RENEWAL_PAYLOAD?: "renew" | string
  IP_RENEWAL_MAX_ATTEMPTS?: number
  IP_RENEWAL_DELAY?: number
}

export interface RouterConfig {
  secret: string
  to: string
  priority: "normal" | "high" | string
  device?: string
  payload: "renew" | string
  maxAttempts: number
  delay: number
}

export interface AutomatePayload {
  secret: string
  to: string
  priority: "normal" | "high" | string
  device?: string
  payload: "renew" | string
}

export interface RenewableRouter extends EventEmitter {
  readonly ip: string | undefined
  readonly lastCachedIp: string | undefined
  readonly attempts: number
  readonly history: IpHistory[]

  init(): Promise<void>

  renew(): Promise<boolean>

  hasNewIp(): boolean
}
