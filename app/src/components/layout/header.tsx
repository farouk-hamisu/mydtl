import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, X, Phone, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useSiteSettings } from '../../hooks/useSiteSettings'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Track', to: '/track' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { settings } = useSiteSettings()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden lg:block bg-teal-950 text-teal-100">
        <div className="mx-auto max-w-[1320px] px-6 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-flame-500" />
              {settings.business_hours || 'Mon – Fri: 08:00 – 18:00'}
            </span>
            <span className="inline-flex items-center gap-2 text-teal-300/80">
              <MapPinSmall /> {settings.contact_address || '1801 Main Street, Kansas City, MO 64108, United States'}
            </span>
            <a href={`tel:${settings.contact_phone || '+1 (816) 555-0140'}`} className="inline-flex items-center gap-2 hover:text-white transition">
              <Phone className="size-3.5" /> {settings.contact_phone || '+1 (816) 555-0140'}
            </a>
          </div>
          <div className="flex items-center gap-5">
            <Socials />
            <Link to="/quote" className="rounded-pill bg-flame-500 px-4 py-1.5 font-semibold text-white transition hover:bg-flame-600">Request Quote</Link>
          </div>
        </div>
      </div>

      <div className={cn('bg-white transition-all duration-300', scrolled ? 'shadow-[0_12px_32px_-20px_rgba(7,80,89,0.45)]' : '')}>
        <div className="mx-auto max-w-[1320px] px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <LogoMark />
            <div className="leading-tight">
              <p className="text-xl font-bold text-teal-950 tracking-tight">SpeedFlightz</p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-flame-600 -mt-0.5">Premium Logistics</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className="text-sm font-semibold text-ink-700 hover:text-teal-950 transition relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-flame-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/track" className="hidden md:inline-flex items-center gap-2 rounded-[14px] bg-flame-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-900 transition shadow-[0_8px_24px_-8px_rgba(249,98,22,0.55)]">
              Track Shipment <ChevronRight className="size-4" />
            </Link>
            <button className="lg:hidden inline-flex items-center justify-center size-10 rounded-full text-teal-900 hover:bg-mist" onClick={() => setOpen(v => !v)}>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className={cn('lg:hidden bg-white border-t border-black/5 overflow-hidden transition-all duration-300', open ? 'max-h-[420px]' : 'max-h-0')}>
        <div className="px-6 py-5 space-y-2">
          {[...navLinks, { label: 'Quote', to: '/quote' }].map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="flex items-center justify-between py-2.5 text-sm font-semibold text-ink-800">
              {l.label}
              <ChevronRight className="size-4 text-flame-500" />
            </Link>
          ))}
          <hr className="my-3 border-black/10" />
          <Link to="/track" onClick={() => setOpen(false)} className="rounded-pill bg-flame-500 px-4 py-2.5 text-center text-sm font-semibold text-white">Track Shipment</Link>
        </div>
      </div>
    </header>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex size-10 rounded-[14px] bg-teal-950 items-center justify-center overflow-hidden ring-1 ring-white/10', className)}>
      <svg viewBox="0 0 64 64" className="size-7"><path d="M14 36 L34 22 V32 L50 22 L42 42 H14 Z" fill="#f96216"/></svg>
    </span>
  )
}

function Socials() {
  return (
    <div className="flex items-center gap-3 text-teal-300">
      {['F','X','in','IG'].map(s => (
        <a key={s} href="#" aria-label={s} className="grid size-7 place-items-center rounded-full text-[10px] font-bold text-teal-200 hover:bg-teal-800 hover:text-white transition">{s}</a>
      ))}
    </div>
  )
}

function MapPinSmall() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
  )
}
