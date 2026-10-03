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
      <div className="hidden lg:block bg-dtl-charcoal text-dtl-white">
        <div className="mx-auto max-w-[1320px] px-6 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-dtl-yellow" />
              {settings.business_hours || 'Mon – Fri: 08:00 – 18:00'}
            </span>
            <span className="inline-flex items-center gap-2 text-dtl-white/70">
              <MapPinSmall /> {settings.contact_address || '1801 Main Street, Kansas City, MO 64108, United States'}
            </span>
            <a href={`tel:${settings.contact_phone || '+1 (415) 498-0913'}`} className="inline-flex items-center gap-2 hover:text-dtl-yellow transition">
              <Phone className="size-3.5" /> {settings.contact_phone || '+1 (415) 498-0913'}
            </a>
          </div>
          <div className="flex items-center gap-5">
            <Socials />
            <Link to="/quote" className="rounded-pill bg-dtl-yellow px-4 py-1.5 font-semibold text-dtl-black transition hover:bg-[#e6b800]">Request Quote</Link>
          </div>
        </div>
      </div>

      <div className={cn('bg-white transition-all duration-300', scrolled ? 'shadow-[0_12px_32px_-20px_rgba(0,0,0,0.12)]' : '')}>
        <div className="mx-auto max-w-[1320px] px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center group" aria-label="DTL home">
            <LogoMark />
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className="text-sm font-semibold text-dtl-charcoal hover:text-dtl-black transition relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-dtl-yellow transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/track" className="hidden md:inline-flex items-center gap-2 rounded-[14px] bg-dtl-yellow px-5 py-2.5 text-sm font-semibold text-dtl-black hover:bg-[#e6b800] transition shadow-[0_8px_24px_-8px_rgba(255,204,0,0.45)]">
              Track Shipment <ChevronRight className="size-4" />
            </Link>
            <button className="lg:hidden inline-flex items-center justify-center size-10 rounded-full text-dtl-black hover:bg-dtl-light-gray" onClick={() => setOpen(v => !v)}>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className={cn('lg:hidden bg-white border-t border-dtl-border overflow-hidden transition-all duration-300', open ? 'max-h-[420px]' : 'max-h-0')}>
        <div className="px-6 py-5 space-y-2">
          {[...navLinks, { label: 'Quote', to: '/quote' }].map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="flex items-center justify-between py-2.5 text-sm font-semibold text-dtl-charcoal">
              {l.label}
              <ChevronRight className="size-4 text-dtl-red" />
            </Link>
          ))}
          <hr className="my-3 border-dtl-border" />
          <Link to="/track" onClick={() => setOpen(false)} className="rounded-pill bg-dtl-yellow px-4 py-2.5 text-center text-sm font-semibold text-dtl-black">Track Shipment</Link>
        </div>
      </div>
    </header>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="DTL Logo"
      className={cn('h-11 sm:h-14 w-auto rounded-lg', className)}
    />
  )
}

function Socials() {
  return (
    <div className="flex items-center gap-3 text-dtl-white/60">
      {['F','X','in','IG'].map(s => (
        <a key={s} href="#" aria-label={s} className="grid size-7 place-items-center rounded-full text-[10px] font-bold text-dtl-white/50 hover:bg-white/10 hover:text-white transition">{s}</a>
      ))}
    </div>
  )
}

function MapPinSmall() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
  )
}