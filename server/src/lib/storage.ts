import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { randomUUID } from 'node:crypto'
import { Readable } from 'node:stream'
import { env } from '../env'

export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
})

interface UploadFileParams {
  contentStream: Readable
  contentType: string
  extension?: string
}

/**
 * Faz upload de um arquivo para o bucket R2 gerando um nome aleatório e único.
 * Retorna a chave e a URL pública (CDN) do arquivo.
 */
export async function uploadFileToStorage({
  contentStream,
  contentType,
  extension = 'csv',
}: UploadFileParams) {
  const fileKey = `${randomUUID()}.${extension}`

  const upload = new Upload({
    client: r2,
    params: {
      Bucket: env.CLOUDFLARE_BUCKET,
      Key: fileKey,
      Body: contentStream,
      ContentType: contentType,
    },
  })

  await upload.done()

  return {
    key: fileKey,
    url: new URL(fileKey, env.CLOUDFLARE_PUBLIC_URL).toString(),
  }
}
