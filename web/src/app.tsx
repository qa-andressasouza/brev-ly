import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/home'
import { Redirect } from './pages/redirect'
import { NotFound } from './pages/not-found'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:shortUrl" element={<Redirect />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
