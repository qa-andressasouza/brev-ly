import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { incrementAccessAndGetOriginal } from '../http/links'
import { NotFound } from './not-found'

export function Redirect() {
  const { shortUrl } = useParams<{ shortUrl: string }>()
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!shortUrl) return

    async function redirect() {
      try {
        const originalUrl = await incrementAccessAndGetOriginal(shortUrl!)
        window.location.replace(originalUrl)
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          setNotFound(true)
          return
        }
        setNotFound(true)
      }
    }

    redirect()
  }, [shortUrl])

  if (notFound) {
    return <NotFound />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold text-blue-base">brev.ly</h1>
      <h2 className="text-xl font-bold text-gray-600">Redirecionando...</h2>
      <p className="max-w-sm text-sm text-gray-400">
        O link será aberto automaticamente em alguns instantes.
      </p>
    </div>
  )
}
