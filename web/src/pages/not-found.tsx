import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-5xl font-bold text-blue-base">404</h1>
      <h2 className="text-xl font-bold text-gray-600">Link não encontrado</h2>
      <p className="max-w-sm text-sm text-gray-400">
        O link que você está tentando acessar não existe, foi removido ou é uma URL inválida.
      </p>
      <Link to="/" className="mt-2 text-sm font-semibold text-blue-base underline">
        Voltar para o início
      </Link>
    </div>
  )
}
