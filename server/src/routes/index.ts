import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { eq, desc, sql } from 'drizzle-orm'
import { Readable } from 'node:stream'
import { db } from '../db/connection'
import { links } from '../db/schema'
import { shortUrlSchema } from '../lib/shorten'
import { uploadFileToStorage } from '../lib/storage'

export const linksRoutes: FastifyPluginAsyncZod = async (app) => {
  // Criar um novo link
  app.post(
    '/links',
    {
      schema: {
        body: z.object({
          originalUrl: z.string().url(),
          shortUrl: shortUrlSchema,
        }),
      },
    },
    async (request, reply) => {
      const { originalUrl, shortUrl } = request.body

      const existing = await db
        .select({ id: links.id })
        .from(links)
        .where(eq(links.shortUrl, shortUrl))

      if (existing.length > 0) {
        return reply.status(409).send({ message: 'Esta URL encurtada já está em uso.' })
      }

      const [created] = await db
        .insert(links)
        .values({ originalUrl, shortUrl })
        .returning()

      return reply.status(201).send(created)
    },
  )

  // Listar todos os links (mais recentes primeiro)
  app.get('/links', async () => {
    const result = await db.select().from(links).orderBy(desc(links.createdAt))
    return { links: result }
  })

  // Obter a URL original a partir do encurtamento
  app.get(
    '/links/:shortUrl',
    {
      schema: { params: z.object({ shortUrl: z.string() }) },
    },
    async (request, reply) => {
      const { shortUrl } = request.params
      const [link] = await db.select().from(links).where(eq(links.shortUrl, shortUrl))
      if (!link) {
        return reply.status(404).send({ message: 'Link não encontrado.' })
      }
      return { originalUrl: link.originalUrl }
    },
  )

  // Incrementar acessos e retornar a URL original (redirecionamento)
  app.patch(
    '/links/:shortUrl/access',
    {
      schema: { params: z.object({ shortUrl: z.string() }) },
    },
    async (request, reply) => {
      const { shortUrl } = request.params
      const [link] = await db
        .update(links)
        .set({ accessCount: sql`${links.accessCount} + 1` })
        .where(eq(links.shortUrl, shortUrl))
        .returning()
      if (!link) {
        return reply.status(404).send({ message: 'Link não encontrado.' })
      }
      return { originalUrl: link.originalUrl }
    },
  )

  // Deletar um link
  app.delete(
    '/links/:shortUrl',
    {
      schema: { params: z.object({ shortUrl: z.string() }) },
    },
    async (request, reply) => {
      const { shortUrl } = request.params
      const deleted = await db
        .delete(links)
        .where(eq(links.shortUrl, shortUrl))
        .returning()
      if (deleted.length === 0) {
        return reply.status(404).send({ message: 'Link não encontrado.' })
      }
      return reply.status(204).send()
    },
  )

  // Exportar os links em CSV e enviar para a CDN (R2)
  app.post('/links/exports', async () => {
    const result = await db.select().from(links).orderBy(desc(links.createdAt))

    const rows = result.map(
      (link) =>
        `${link.originalUrl},${link.shortUrl},${link.accessCount},${link.createdAt.toISOString()}`,
    )

    const csv = ['original_url,short_url,access_count,created_at', ...rows].join('\n')

    const { url } = await uploadFileToStorage({
      contentStream: Readable.from([csv]),
      contentType: 'text/csv',
    })

    return { reportUrl: url }
  })
}
