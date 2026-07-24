import { motion } from 'framer-motion'
import { fadeUp, viewport } from '../lib/motion'
import { SectionLabel } from './_section'

const items = [
  { url: '/airfright.jpg', title: 'Boeing 747 Freighter Loading', category: 'Air Freight' },
  { url: '/oceancargoship.jpg', title: 'MV Ocean Pioneer — Indian Ocean Transit', category: 'Sea Freight' },
  { url: '/warehouse.jpg', title: 'Bonded Warehousing & Distribution', category: 'Warehousing' },
  { url: '/cargoplane.jpg', title: 'Overnight Express Cargo Dispatch', category: 'Air Freight' },
  { url: '/roadtransport.jpg', title: 'Cross-Border Trucking Fleet', category: 'Road Freight' },
  { url: '/porthandling.jpg', title: 'Port Handling & Stevedoring', category: 'Sea Freight' },
  { url: '/seafright.jpg', title: 'Container Ship at Terminal', category: 'Sea Freight' },
  { url: '/courier.jpg', title: 'Express Courier Last-Mile Delivery', category: 'Courier' },
  { url: '/security.jpg', title: 'Cargo Security Screening', category: 'Security' },
  { url: '/image1.jpg', title: 'Global Logistics Network Hub', category: 'Operations' },
  { url: '/image2.jpg', title: 'Freight Forwarding Operations', category: 'Operations' },
  { url: '/image3.jpg', title: 'Container Terminal Operations', category: 'Sea Freight' },
  { url: '/image4.jpg', title: 'Supply Chain Management Center', category: 'Operations' },
]

export function Gallery() {

  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <SectionLabel>Our work in motion</SectionLabel>
            <h2 className="mt-4 text-4xl lg:text-[3rem] font-bold text-teal-950 leading-[1.08] text-balance max-w-2xl">
              Photographs from the field — ports, planes, and pallets.
            </h2>
          </div>
          <a href="/gallery" className="inline-flex items-center gap-2 text-sm font-semibold text-flame-600 hover:text-teal-900">View full gallery →</a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[220px]">
          {items.slice(0, 12).map((g, i) => (
            <motion.figure
              key={g.id ?? i}
              variants={fadeUp} custom={i}
              initial="hidden" whileInView="show" viewport={viewport}
              className={`relative overflow-hidden rounded-card ring-1 ring-black/5 ${spanClass(i)}`}
            >
              <img src={g.url} alt={g.title || ''} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              <figcaption className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-teal-950/10 to-transparent p-5 flex flex-col justify-end text-white">
                {g.category && <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-flame-400">{g.category}</span>}
                {g.title && <p className="text-base font-semibold">{g.title}</p>}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function spanClass(i: number) {
  const pattern = [
    'lg:col-span-2 lg:row-span-2',
    '',
    '',
    'lg:col-span-2',
    '',
    'lg:row-span-2 lg:col-span-2',
    '',
    '',
    'lg:col-span-2 lg:row-span-2',
    '',
    '',
    'lg:col-span-2',
  ]
  return pattern[i % pattern.length]
}
