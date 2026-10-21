import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import './index.css'
import { loadData } from './data/repo'
import { AppStateProvider } from './state/AppState'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { DishPage } from './pages/DishPage'
import { PlacePage } from './pages/PlacePage'
import { Browse } from './pages/Browse'
import { NotFound } from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

const root = createRoot(document.getElementById('root')!)

root.render(<p>Loading…</p>)

loadData()
  .then(() => {
    root.render(
      <StrictMode>
        <AppStateProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="dishes" element={<Browse />} />
                <Route path="dish/:id" element={<DishPage />} />
                <Route path="place/:id" element={<PlacePage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppStateProvider>
      </StrictMode>,
    )
  })
  .catch(() => {
    root.render(<p>Could not load data. Is the API server running?</p>)
  })