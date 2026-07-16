import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Copy, Trash2, Download, Link2 } from 'lucide-react'
import { getLinks, deleteLink, exportLinks } from '../http/links'
import { buildShortUrl, formatShortUrl } from '../lib/utils'

export function LinksList() {
  const queryClient = useQueryClient()

  const { data: links, isLoading } = useQuery({
    queryKey: ['links'],
    queryFn: getLinks,
  })

  const { mutateAsync: deleteLinkFn } = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })

  const { mutateAsync: exportLinksFn, isPending: isExporting } = useMutation({
    mutationFn: exportLinks,
  })

  async function handleCopy(shortUrl: string) {
    await navigator.clipboard.writeText(buildShortUrl(shortUrl))
    toast.success('Link copiado para a área de transferência!')
  }

  async function handleDelete(shortUrl: string) {
    const confirmed = window.confirm('Tem certeza que deseja excluir este link?')
    if (!confirmed) return
    try {
      await deleteLinkFn(shortUrl)
      toast.success('Link excluído com sucesso!')
    } catch {
      toast.error('Erro ao excluir o link.')
    }
  }

  async function handleExport() {
    try {
      const reportUrl = await exportLinksFn()
      window.open(reportUrl, '_blank')
      toast.success('Relatório CSV gerado com sucesso!')
    } catch {
      toast.error('Erro ao gerar o relatório CSV.')
    }
  }

  return (
    <div className="flex w-full flex-col gap-5 rounded-lg bg-white p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-600">Meus links</h2>
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting || !links?.length}
          className="flex items-center gap-2 rounded bg-gray-200 px-3 py-2 text-xs font-semibold text-gray-500 transition-colors hover:bg-gray-300 disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {isExporting ? 'Gerando...' : 'Baixar CSV'}
        </button>
      </div>

      <div className="h-px w-full bg-gray-200" />

      {isLoading && (
        <p className="py-8 text-center text-sm text-gray-400">Carregando links...</p>
      )}

      {!isLoading && !links?.length && (
        <div className="flex flex-col items-center gap-2 py-8 text-gray-400">
          <Link2 className="h-8 w-8" />
          <p className="text-xs uppercase">Ainda não existem links cadastrados</p>
        </div>
      )}

      <ul className="flex flex-col">
        {links?.map((link) => (
          <li
            key={link.id}
            className="flex items-center justify-between gap-4 border-b border-gray-200 py-4 last:border-b-0"
          >
            <div className="flex flex-col overflow-hidden">
              <a
                href={buildShortUrl(link.shortUrl)}
                target="_blank"
                rel="noreferrer"
                className="truncate text-sm font-semibold text-blue-base"
              >
                {formatShortUrl(link.shortUrl)}
              </a>
              <span className="truncate text-xs text-gray-400">{link.originalUrl}</span>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span className="text-xs text-gray-400">{link.accessCount} acessos</span>
              <button
                type="button"
                onClick={() => handleCopy(link.shortUrl)}
                className="rounded bg-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-300"
                title="Copiar link"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(link.shortUrl)}
                className="rounded bg-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-300"
                title="Excluir link"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
