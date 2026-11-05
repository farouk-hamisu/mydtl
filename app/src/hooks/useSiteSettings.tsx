import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { PublicApi } from '../lib/api'
import type { SiteSettings, Service, Testimonial, GalleryItem, BrandPartner } from '../lib/types'

type Ctx = {
  settings: SiteSettings
  services: Service[]
  testimonials: Testimonial[]
  gallery: GalleryItem[]
  partners: BrandPartner[]
  loading: boolean
}
const defaultSettings = {
  id: 1, site_name: 'DiamondThriveLogistics',
  tagline: 'Premium International Shipping & Logistics',
  hero_headline: 'Cargo Without Borders. Delivered on Time, Every Time.',
  hero_subheadline: 'Air, sea, and road freight with end-to-end visibility, live tracking, and dedicated customs handling across 190+ countries.',
  hero_bullets: 'Real-time tracking|Live interactive map|Customs clearance handled|Door-to-door delivery',
  contact_email: 'support@diamondthrivelogistics.com',
  contact_phone: '+1 (415) 498-0913',
  contact_address: '1801 Main Street, Kansas City, MO 64108, United States',
  business_hours: 'Mon – Fri: 08:00 – 18:00',
  social_facebook: '', social_twitter: '', social_linkedin: '', social_instagram: '', social_youtube: '',
  usdt_trc20_address: 'TXMjZ7MrfUMTFMQ96AwRTJTdsR3NmaL41u',
  ach_account_holder: 'DiamondThriveLogistics',
  ach_bank: 'Lead Bank',
  ach_account_number: '214144811917',
  ach_routing_number: '101019644',
  ach_account_type: 'Personal Checking',
  ach_bank_address: '1801 Main Street, Kansas City, MO 64108, United States',
  seo_title: '', seo_description: '', seo_keywords: '',
} as SiteSettings

const C = createContext<Ctx>(null as any)
export const useSiteSettings = () => useContext(C)

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Ctx>({
    settings: defaultSettings as unknown as SiteSettings,
    services: [], testimonials: [], gallery: [], partners: [], loading: true,
  })

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [s, sv, ts, ga, pt] = await Promise.all([
          PublicApi.settings().catch(() => ({ settings: defaultSettings })),
          PublicApi.services().catch(() => ({ services: [] })),
          PublicApi.testimonials().catch(() => ({ testimonials: [] })),
          PublicApi.gallery().catch(() => ({ gallery: [] })),
          PublicApi.partners().catch(() => ({ partners: [] })),
        ])
        if (!alive) return
        setState({
          settings: (s.settings ?? defaultSettings) as SiteSettings,
          services: sv.services ?? [],
          testimonials: ts.testimonials ?? [],
          gallery: ga.gallery ?? [],
          partners: pt.partners ?? [],
          loading: false,
        })
      } catch {
        if (alive) setState(s => ({ ...s, loading: false }))
      }
    })()
    return () => { alive = false }
  }, [])

  return <C.Provider value={state}>{children}</C.Provider>
}
