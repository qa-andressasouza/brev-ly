import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(),
  CLOUDFLARE_ACCOUNT_ID: z.string().default(''),
  CLOUDFLARE_ACCESS_KEY_ID: z.string().default(''),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string().default(''),
  CLOUDFLARE_BUCKET: z.string().default(''),
  CLOUDFLARE_PUBLIC_URL: z.string().default(''),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
