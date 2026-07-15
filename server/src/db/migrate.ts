import { client } from './connection'

async function migrate() {
  console.log('⏳ Running migrations...')

  await client`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`

  await client`
    CREATE TABLE IF NOT EXISTS "links" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "original_url" text NOT NULL,
      "short_url" text NOT NULL,
      "access_count" integer DEFAULT 0 NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "links_short_url_unique" UNIQUE ("short_url")
    )
  `

  console.log('✅ Migrations finished!')
  await client.end()
  process.exit(0)
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
