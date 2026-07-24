import { SectionLabel } from '../sections/_section'
import { Card } from '../components/ui/primitives'
import { Truck, Plane, Anchor } from 'lucide-react'

export function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="relative bg-teal-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <img src="/porthandling.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="relative mx-auto max-w-[1320px] px-6">
          <SectionLabel>About SpeedFlightz</SectionLabel>
          <h1 className="mt-4 text-4xl lg:text-[3.2rem] font-bold leading-[1.08] text-balance">Premium logistics for businesses that demand precision.</h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold text-teal-950">Built by operators, for operators.</h2>
            <p className="mt-5 text-base text-ink-600 leading-relaxed">SpeedFlightz was founded by a team of freight forwarders, customs brokers, and supply-chain engineers who believed the logistics experience should match the quality of the cargo being moved. We operate across 190+ countries with bonded warehousing, a 24/7 dispatch desk, and the same SDK-grade tracking infrastructure used by Fortune 500 companies.</p>
            <p className="mt-4 text-base text-ink-600 leading-relaxed">Our platform provides real-time visibility, digital customs duty management, multi-modal shipping (air, sea, road), and live map tracking — all from one dashboard.</p>

            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              <img src="/warehouse.jpg" alt="Bonded warehousing" className="rounded-card w-full h-48 object-cover ring-1 ring-black/5" />
              <img src="/cargoplane.jpg" alt="Air cargo operations" className="rounded-card w-full h-48 object-cover ring-1 ring-black/5" />
            </div>
          </div>

          <div className="space-y-6">
            <Card className="overflow-hidden ring-1 ring-black/5">
              <img src="/security.jpg" alt="" className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center gap-3 text-teal-900">
                  <Truck className="size-5 text-flame-600" />
                  <span className="font-semibold">Headquarters: Kansas City, MO</span>
                </div>
                <p className="mt-2 text-sm text-ink-600">Our central hub manages shipments before they route to any port, airport, or border crossing globally.</p>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-5 ring-1 ring-black/5">
                <Plane className="size-6 text-flame-600" />
                <p className="mt-2 text-2xl font-bold text-teal-950">190+</p>
                <p className="text-xs text-ink-600 uppercase tracking-wide font-semibold">Countries Covered</p>
              </Card>
              <Card className="p-5 ring-1 ring-black/5">
                <Anchor className="size-6 text-flame-600" />
                <p className="mt-2 text-2xl font-bold text-teal-950">45+</p>
                <p className="text-xs text-ink-600 uppercase tracking-wide font-semibold">Port Partnerships</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mist py-20">
        <div className="mx-auto max-w-[1320px] px-6">
          <h2 className="text-3xl font-bold text-teal-950 text-center">Our Network in Action</h2>
          <p className="mt-3 text-base text-ink-600 text-center max-w-lg mx-auto">From warehousing to last-mile delivery — see the infrastructure behind every shipment.</p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <img src="/porthandling.jpg" alt="Port operations" className="rounded-card w-full h-44 object-cover ring-1 ring-black/5" />
            <img src="/seafright.jpg" alt="Sea freight" className="rounded-card w-full h-44 object-cover ring-1 ring-black/5" />
            <img src="/courier.jpg" alt="Courier delivery" className="rounded-card w-full h-44 object-cover ring-1 ring-black/5" />
            <img src="/airfright.jpg" alt="Air freight" className="rounded-card w-full h-44 object-cover ring-1 ring-black/5" />
          </div>
        </div>
      </section>
    </div>
  )
}
