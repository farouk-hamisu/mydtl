import { Hero } from '../sections/hero'
import { Partners } from '../sections/partners'
import { About } from '../sections/about'
import { Services } from '../sections/services'
import { WhyChoose } from '../sections/why-choose'
import { Stats } from '../sections/stats'
import { Process } from '../sections/process'
import { Gallery } from '../sections/gallery'
import { Testimonials } from '../sections/testimonials'
import { FAQ } from '../sections/faq'
import { Newsletter } from '../sections/newsletter'
import { Contact } from '../sections/contact'

export function HomePage() {
  return (
    <>
      <Hero />
      <Partners />
      <About />
      <WhyChoose />
      <Stats />
      <Services />
      <Process />
      <Gallery />
      <Testimonials />
      <FAQ />
      <Contact />
      <Newsletter />
    </>
  )
}
