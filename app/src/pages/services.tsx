import { SectionLabel } from '../sections/_section'
export function ServicesPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="relative bg-teal-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="relative mx-auto max-w-[1320px] px-6">
          <SectionLabel>Our services</SectionLabel>
          <h1 className="mt-4 text-4xl lg:text-[3.2rem] font-bold leading-[1.08] text-balance">A complete freight toolkit.</h1>
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-6 py-20 grid md:grid-cols-3 gap-6">
        {[
          { t: 'Air Freight', d: 'Express international air cargo with daily departures and priority boarding for time-critical shipments.', img: '/airfright.jpg' },
          { t: 'Sea Freight', d: 'FCL and LCL ocean freight with competitive transit times and dedicated customs handling.', img: '/seafright.jpg' },
          { t: 'Road Freight', d: 'Cross-border trucking across North America and Europe with tracked fleet.', img: '/roadtransport.jpg' },
          { t: 'Customs Clearance', d: 'Bonded customs brokerage with document preparation, duty calculation and regulatory compliance.', img: '/security.jpg' },
          { t: 'Warehousing', d: 'Secure storage, pick & pack, inventory management, and distribution from bonded facilities.', img: '/warehouse.jpg' },
          { t: 'Express Courier', d: 'Time-critical small parcels with door-to-door tracking and expedited customs clearance.', img: '/courier.jpg' },
        ].map(s => (
          <div key={s.t} className="rounded-card overflow-hidden ring-1 ring-black/5 shadow-[0_40px_120px_-40px_rgba(7,80,89,0.35)]">
            <img src={s.img} alt={s.t} className="w-full h-56 object-cover" />
            <div className="p-6"><h3 className="text-2xl font-bold text-teal-950">{s.t}</h3><p className="mt-2 text-base text-ink-600 leading-relaxed">{s.d}</p></div>
          </div>
        ))}
      </section>
    </div>
  )
}
