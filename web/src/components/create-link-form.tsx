import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { createLink } from '../http/links'

const createLinkSchema = z.object({
  originalUrl: z.string().url({ message: 'Informe uma URL válida.' }),
  shortUrl: z
    .string()
    .min(3, { message: 'Mínimo de 3 caracteres.' })
    .regex(/^[a-zA-Z0-9-_]+$/, {
      message: 'Use apenas letras, números, - e _.',
    }),
})

type CreateLinkFormData = z.infer<typeof createLinkSchema>

export function CreateLinkForm() {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
  })

  const { mutateAsync: createLinkFn } = useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })

  async function handleCreateLink(data: CreateLinkFormData) {
    try {
      await createLinkFn(data)
      toast.success('Link criado com sucesso!')
      reset()
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.error('Essa URL encurtada já existe.')
        return
      }
      toast.error('Erro ao criar o link. Tente novamente.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleCreateLink)}
      className="flex w-full flex-col gap-5 rounded-lg bg-white p-6 md:p-8"
    >
      <h2 className="text-lg font-bold text-gray-600">Novo link</h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="originalUrl" className="text-xs font-medium uppercase text-gray-500">
          Link original
        </label>
        <input
          id="originalUrl"
          type="text"
          placeholder="www.exemplo.com.br"
          className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-base"
          {...register('originalUrl')}
        />
        {errors.originalUrl && (
          <span className="text-xs text-danger">{errors.originalUrl.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="shortUrl" className="text-xs font-medium uppercase text-gray-500">
          Link encurtado
        </label>
        <div className="flex items-center rounded-lg border border-gray-300 px-4 py-3 focus-within:border-blue-base">
          <span className="text-sm text-gray-400">brev.ly/</span>
          <input
            id="shortUrl"
            type="text"
            className="w-full bg-transparent text-sm outline-none"
            {...register('shortUrl')}
          />
        </div>
        {errors.shortUrl && (
          <span className="text-xs text-danger">{errors.shortUrl.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-lg bg-blue-base py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-dark disabled:opacity-60"
      >
        {isSubmitting ? 'Salvando...' : 'Salvar link'}
      </button>
    </form>
  )
}
