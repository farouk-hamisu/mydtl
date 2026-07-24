import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'leaflet/dist/leaflet.css'
import './index.css'
import { AuthProvider } from './hooks/useAuth'
import { SiteSettingsProvider } from './hooks/useSiteSettings'
import { router } from './lib/router'

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30_000 } } })

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <SiteSettingsProvider>
          <RouterProvider router={router} />
        </SiteSettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
