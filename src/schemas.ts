import dotenv from "dotenv"
import { z } from "zod"

/**
 * Define the priority level options.
 * @type {z.ZodEnum}
 */
export const RenewalPrioritySchema = z.enum(["normal", "high"])

/**
 * Define the trigger expected in the Automate payload.
 * @type {z.ZodEnum}
 */
export const RenewalPayloadContentSchema = z.union([
  z.enum(["renew"]),
  z.string()
])

/**
 * Template a dot env required value message.
 *
 * @param {string} value
 * @returns {string}
 */
const createDotenvMessage = (value: string): string =>
  `You must create a .env file in your project root with the "${value}" value. See https://github.com/motdotla/dotenv for more information on dotenv.`

/**
 * Define a validation schema for environment variables.
 * @type {z.ZodObject}
 */
export const EnvSchema = z.object({
  IP_RENEWAL_SECRET: z.string({
    required_error: createDotenvMessage("IP_RENEWAL_SECRET")
  }),
  IP_RENEWAL_EMAIL: z
    .string({
      required_error: createDotenvMessage("IP_RENEWAL_EMAIL")
    })
    .email(),
  IP_RENEWAL_PRIORITY: RenewalPrioritySchema.default("normal"),
  IP_RENEWAL_PAYLOAD_CONTENT: RenewalPayloadContentSchema.default("renew"),
  IP_RENEWAL_MAX_ATTEMPTS: z.string().regex(/^\d+$/).transform(Number),
  IP_RENEWAL_DELAY: z.string().regex(/^\d+$/).transform(Number),
  POLL_ATTEMPTS: z.string().regex(/^\d+$/).transform(Number),
  POLL_TIMEOUT: z.string().regex(/^\d+$/).transform(Number),
  TOGGLE_DELAY: z.string().regex(/^\d+$/).transform(Number),
  IPDATA_API_KEY: z.string().default("test"),
})

/**
 * Exports a typed env file.
 * @type {RouterEnv}
 */
export const env: z.infer<typeof EnvSchema> = EnvSchema.parse(
  dotenv.config().parsed ?? {}
)
/**
 * Define a validation schema for the request sent to the Automate endpoint.
 * @type {z.ZodObject}
 */
export const AutomatePayloadSchema = z.object({
  secret: z.string().default(env.IP_RENEWAL_SECRET),
  to: z.string().email().default(env.IP_RENEWAL_EMAIL),
  priority: RenewalPrioritySchema.default(env.IP_RENEWAL_PRIORITY),
  device: z.string().optional(),
  payload: RenewalPayloadContentSchema.default(env.IP_RENEWAL_PAYLOAD_CONTENT)
})

/**
 * Define the possible values for IPData field selection.
 * @type {z.ZodArray}
 */
export const IpDataFieldsSchema = z.array(
  z.enum([
    "ip",
    "city",
    "region",
    "region_code",
    "postal",
    "country_name",
    "country_code",
    "asn",
    "carrier",
    "time_zone",
    "threat"
  ])
)

/**
 * Define validation schema for IPData vendor config.
 * @type {z.ZodObject}
 */
export const IpDataConfigSchema = z.object({
  key: z.string().default(env.IPDATA_API_KEY),
  fields: IpDataFieldsSchema.default([
    "ip",
    "city",
    "region",
    "region_code",
    "postal",
    "country_name",
    "country_code",
    "asn",
    "carrier",
    "time_zone",
    "threat"
  ])
})

/**
 * Define a validation schema for top level router config which extends the Automate schema.
 * @type {z.ZodObject}
 */
export const RouterConfigSchema = AutomatePayloadSchema.extend({
  maxAttempts: z.number().default(env.IP_RENEWAL_MAX_ATTEMPTS),
  delay: z.number().default(env.IP_RENEWAL_DELAY),
  ipdata: IpDataConfigSchema.default({})
})

/**
 * Define a partial of the base router config to allow passing incomplete configs.
 * @type {z.ZodObject}
 */
export const PartialRouterConfigSchema = RouterConfigSchema.deepPartial()

/**
 * Define the schema for an expected response from the IPData vendor service.
 * @type {z.ZodObject}
 */
export const IpDataResponseSchema = z.object({
  ip: z.string(),
  city: z.string().optional(),
  region: z.string().optional(),
  region_code: z.string().optional(),
  country_name: z.string().optional(),
  country_code: z.string().optional(),
  postal: z.string().optional(),
  time_zone: z
    .object({
      name: z.string(),
      abbr: z.string(),
      offset: z.string(),
      is_dst: z.boolean(),
      current_time: z.string()
    })
    .optional(),
  threat: z
    .object({
      is_tor: z.boolean(),
      is_proxy: z.boolean(),
      is_anonymous: z.boolean(),
      is_known_attacker: z.boolean(),
      is_known_abuser: z.boolean(),
      is_threat: z.boolean(),
      is_bogon: z.boolean()
    })
    .optional(),
  statusCode: z.number().optional(),
  statusMessage: z.string().optional()
})

/**
 * Define the shape of IP history records.
 * @type {z.ZodObject}
 */
export const IpHistorySchema = IpDataResponseSchema.extend({
  ip: z.string(),
  timestamp: z.number()
})
