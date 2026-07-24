import { createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router'
import { RootLayout } from '../components/layout/root'
import { TrackPage } from '../pages/track'
import { HomePage } from '../pages/home'
import { ServicesPage } from '../pages/services'
import { AboutPage } from '../pages/about'
import { GalleryPage } from '../pages/gallery'
import { ContactPage } from '../pages/contact'
import { QuotePage } from '../pages/quote'
import { AdminLoginPage } from '../pages/admin-login'
import { AdminLayout, AdminOverview, AdminShipments, AdminShipment, AdminPayments, AdminContent, AdminSettings, AdminMedia } from '../pages/admin'

function TrackLayout() { return <Outlet /> }

const rootRoute = createRootRoute({ component: RootLayout })

const home = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage })
const trackLayout = createRoute({ getParentRoute: () => rootRoute, path: '/track', component: TrackLayout })
const trackIndex = createRoute({ getParentRoute: () => trackLayout, path: '/', component: TrackPage })
const trackResult = createRoute({ getParentRoute: () => trackLayout, path: '$trackingNumber', component: TrackPage })
const services = createRoute({ getParentRoute: () => rootRoute, path: '/services', component: ServicesPage })
const about = createRoute({ getParentRoute: () => rootRoute, path: '/about', component: AboutPage })
const gallery = createRoute({ getParentRoute: () => rootRoute, path: '/gallery', component: GalleryPage })
const contact = createRoute({ getParentRoute: () => rootRoute, path: '/contact', component: ContactPage })
const quote = createRoute({ getParentRoute: () => rootRoute, path: '/quote', component: QuotePage })

const adminLogin = createRoute({ getParentRoute: () => rootRoute, path: '/admin/login', component: AdminLoginPage })
const adminLayout = createRoute({ getParentRoute: () => rootRoute, path: '/admin', component: AdminLayout })
const adminHome = createRoute({ getParentRoute: () => adminLayout, path: '/', component: AdminOverview })
const adminShipments = createRoute({ getParentRoute: () => adminLayout, path: 'shipments', component: AdminShipments })
const adminShipment = createRoute({ getParentRoute: () => adminLayout, path: 'shipments/$id', component: AdminShipment })
const adminPayments = createRoute({ getParentRoute: () => adminLayout, path: 'payments', component: AdminPayments })
const adminContent = createRoute({ getParentRoute: () => adminLayout, path: 'content', component: AdminContent })
const adminMedia = createRoute({ getParentRoute: () => adminLayout, path: 'media', component: AdminMedia })
const adminSettings = createRoute({ getParentRoute: () => adminLayout, path: 'settings', component: AdminSettings })

export const router = createRouter({
  routeTree: rootRoute.addChildren([
    home, trackLayout.addChildren([trackIndex, trackResult]), services, about, gallery, contact, quote, adminLogin,
    adminLayout.addChildren([
      adminHome, adminShipments, adminShipment, adminPayments, adminContent, adminMedia, adminSettings,
    ]),
  ]),
  defaultPreload: 'intent',
})
