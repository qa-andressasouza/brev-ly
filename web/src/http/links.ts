import { api } from '../lib/api'

export interface Link {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: number
  createdAt: string
}

export async function getLinks(): Promise<Link[]> {
  const response = await api.get<{ links: Link[] }>('/links')
  return response.data.links
}

export async function createLink(data: {
  originalUrl: string
  shortUrl: string
}) {
  const response = await api.post('/links', data)
  return response.data
}

export async function deleteLink(shortUrl: string) {
  await api.delete(`/links/${shortUrl}`)
}

export async function incrementAccessAndGetOriginal(
  shortUrl: string,
): Promise<string> {
  const response = await api.patch<{ originalUrl: string }>(
    `/links/${shortUrl}/access`,
  )
  return response.data.originalUrl
}

export async function exportLinks(): Promise<string> {
  const response = await api.post<{ reportUrl: string }>('/links/exports')
  return response.data.reportUrl
}
