import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { linksRoutes } from './routes'

export function buildApp() {
  const app = fastify().withTypeProvider<ZodTypeProvider>()

  // Zod como validador e serializador
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  // Habilita CORS
  app.register(fastifyCors, { origin: '*' })

  app.get('/health', () => {
    return { status: 'ok' }
  })

  app.register(linksRoutes)

  return app
}
