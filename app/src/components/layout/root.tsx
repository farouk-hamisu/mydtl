import { Outlet } from '@tanstack/react-router'
import { Suspense } from 'react'
import { Header } from './header'
import { Footer } from './footer'

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="grid place-items-center min-h-[40vh] text-teal-900 animate-pulse">Loading…</div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
