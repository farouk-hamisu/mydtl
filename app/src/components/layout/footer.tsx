import { Link } from '@tanstack/react-router'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { LogoMark } from './header'
import { useSiteSettings } from '../../hooks/useSiteSettings'

export function Footer() {
  const { settings } = useSiteSettings()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-dtl-charcoal text-dtl-white">
      <div className="mx-auto max-w-[1320px] px-6 pt-16 pb-10">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <LogoMark className="h-16" />
            <p className="mt-5 text-sm leading-relaxed text-dtl-white/70 max-w-sm">
              Premium international shipping with end-to-end visibility, live tracking, and dedicated customs handling across 190+ countries.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Air','Sea','Road','Customs'].map(t => (
                <span key={t} className="rounded-pill bg-dtl-black/50 ring-1 ring-white/10 px-3 py-1 text-xs font-semibold text-dtl-white/80">{t}</span>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-dtl-red">Company</p>
            <ul className="mt-4 space-y-2 text-sm text-dtl-white/80">
              {['About','Services','Track','Gallery','Contact'].map(l => (
                <li key={l}><Link to={`/${l.toLowerCase()}`} className="hover:text-white transition">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-dtl-red">Account</p>
            <ul className="mt-4 space-y-2 text-sm text-dtl-white/80">
              <li><Link to="/login" className="hover:text-white transition">Sign in</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition">Customer dashboard</Link></li>
              <li><Link to="/track" className="hover:text-white transition">Track shipment</Link></li>
              <li><Link to="/quote" className="hover:text-white transition">Request a quote</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-dtl-red">Get in touch</p>
            <ul className="mt-4 space-y-3 text-sm text-dtl-white/80">
              <li className="flex items-start gap-3 break-words"><MapPin className="size-4 mt-0.5 text-dtl-red shrink-0" /> <span>{settings.contact_address || '1801 Main Street, Kansas City, MO 64108, United States'}</span></li>
              <li className="flex items-center gap-3"><Phone className="size-4 text-dtl-red shrink-0" /> <a href={`tel:${settings.contact_phone || '+1 (816) 555-0140'}`} className="hover:text-white whitespace-nowrap">{settings.contact_phone || '+1 (816) 555-0140'}</a></li>
              <li className="flex items-start gap-3 break-words"><Mail className="size-4 mt-0.5 text-dtl-red shrink-0" /> <a href={`mailto:${settings.contact_email || 'support@dtl.com'}`} className="hover:text-white">{settings.contact_email || 'support@dtl.com'}</a></li>
            </ul>
            <form className="mt-6 flex gap-2" onSubmit={(e) => { e.preventDefault() }}>
              <input
                type="email" placeholder="Get dispatch updates" required
                className="flex-1 rounded-[14px] bg-dtl-black/50 ring-1 ring-white/10 px-4 py-2.5 text-sm text-white placeholder:text-dtl-white/50 focus:outline-none focus:ring-2 focus:ring-dtl-yellow"
              />
              <button className="rounded-[14px] bg-dtl-red px-4 py-2.5 text-white hover:bg-[#b8040e] transition">
                <ArrowRight className="size-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-dtl-white/50">
          <p>© {year} DTL Global Logistics. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Customs</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}