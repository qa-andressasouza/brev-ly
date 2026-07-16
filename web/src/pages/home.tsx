import { CreateLinkForm } from '../components/create-link-form'
import { LinksList } from '../components/links-list'

export function Home() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-8 md:py-20">
      <h1 className="text-2xl font-bold text-blue-base">brev.ly</h1>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="w-full md:max-w-sm">
          <CreateLinkForm />
        </div>
        <div className="w-full flex-1">
          <LinksList />
        </div>
      </div>
    </div>
  )
}
