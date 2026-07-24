import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SectionLabel } from '../sections/_section'
import { PublicApi } from '../lib/api'
import { fadeUp, viewport } from '../lib/motion'
import type { GalleryItem } from '../lib/types'

const localImages: (GalleryItem & { category?: string })[] = [
  { id: 'local-1', url: '/airfright.jpg', title: 'Boeing 747 Freighter Loading at Dusk', category: 'Air Freight', sort_order: 0 },
  { id: 'local-2', url: '/oceancargoship.jpg', title: 'MV Ocean Pioneer — Indian Ocean Transit', category: 'Sea Freight', sort_order: 1 },
  { id: 'local-3', url: '/warehouse.jpg', title: 'Bonded Warehousing & Distribution Center', category: 'Warehousing', sort_order: 2 },
  { id: 'local-4', url: '/cargoplane.jpg', title: 'Overnight Express Cargo Dispatch', category: 'Air Freight', sort_order: 3 },
  { id: 'local-5', url: '/roadtransport.jpg', title: 'Cross-Border Trucking Fleet on Highway', category: 'Road Freight', sort_order: 4 },
  { id: 'local-6', url: '/porthandling.jpg', title: 'Port Handling & Stevedoring Operations', category: 'Sea Freight', sort_order: 5 },
  { id: 'local-7', url: '/seafright.jpg', title: 'Container Ship at Full Capacity', category: 'Sea Freight', sort_order: 6 },
  { id: 'local-8', url: '/courier.jpg', title: 'Express Courier Last-Mile Delivery', category: 'Courier', sort_order: 7 },
  { id: 'local-9', url: '/security.jpg', title: 'Cargo Security Screening Facility', category: 'Security', sort_order: 8 },
  { id: 'local-10', url: '/image1.jpg', title: 'Global Logistics Network Hub', category: 'Operations', sort_order: 9 },
  { id: 'local-11', url: '/image2.jpg', title: 'Freight Forwarding Command Center', category: 'Operations', sort_order: 10 },
  { id: 'local-12', url: '/image3.jpg', title: 'Container Terminal Operations at Night', category: 'Sea Freight', sort_order: 11 },
  { id: 'local-13', url: '/image4.jpg', title: 'Strategic Supply Chain Management', category: 'Operations', sort_order: 12 },
]

export function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    PublicApi.gallery()
      .then(data => {
        setItems(data.length ? data : localImages)
      })
      .catch(e => {
        setError(e.message)
        setItems(localImages)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-white min-h-screen">
      <section className="relative bg-teal-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <img
          src="/oceancargoship.jpg"
          alt="" className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="relative mx-auto max-w-[1320px] px-6">
          <SectionLabel>Gallery</SectionLabel>
          <h1 className="mt-4 text-4xl lg:text-[3.2rem] font-bold leading-[1.08] text-balance">Moments that move the world.</h1>
          <p className="mt-4 max-w-xl text-lg text-teal-100/80">A visual journey through our global freight operations — from port to plane to your doorstep.</p>
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-6 py-20">
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-card bg-ink-100 animate-pulse" />
            ))}
          </div>
        )}
        {error && !items.length && <p className="text-rose-600 text-center py-20">{error}</p>}
        {!loading && items.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                variants={fadeUp} custom={i}
                initial="hidden" whileInView="show" viewport={viewport}
                className="break-inside-avoid rounded-card overflow-hidden ring-1 ring-black/5 shadow-[0_24px_60px_-32px_rgba(7,80,89,0.18)]"
              >
                <img src={item.url} alt={item.title ?? ''} className="w-full object-cover transition-transform duration-700 hover:scale-105" />
                {item.title && (
                  <div className="p-4">
                    <p className="text-sm font-semibold text-teal-950">{item.title}</p>
                    {'category' in item && item.category && (
                      <span className="mt-1 inline-block text-[10px] uppercase tracking-[0.18em] font-bold text-flame-600">{item.category}</span>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
