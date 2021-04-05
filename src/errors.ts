import { debug } from "./utils"

export class RenewalFailedError extends Error {
  public constructor(public readonly attempts: number) {
    super(`Could not obtain a new IP address after ${attempts} attempts.`)
    debug(this.message)
  }
}
