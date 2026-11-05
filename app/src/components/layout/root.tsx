import { Outlet } from '@tanstack/react-router'
import { Suspense } from 'react'
import { Header } from './header'
import { Footer } from './footer'
import { WhatsAppButton } from './whatsapp-button'

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <div className="grid place-items-center gap-4 min-h-[40vh] py-20">
            <img src="/logo.png" alt="DiamondThriveLogistics" className="h-16 w-auto rounded-lg animate-pulse" />
            <span className="inline-block size-6 rounded-full border-2 border-dtl-border border-t-dtl-yellow animate-spin" />
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
