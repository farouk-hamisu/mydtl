import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useMemo, useEffect, useRef } from 'react'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const C = {
  origin: '#0e5a68',
  destination: '#06222a',
  current: '#f96216',
  route: '#189cb5',
  routeDash: '#f96216',
  text: '#06222a',
  textMuted: '#2c5157',
  white: '#ffffff',
}

function makeIcon(color: string, label?: string, pulse?: boolean) {
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;transform:translate(-50%,-50%);">
      ${pulse ? `<span style="position:absolute;left:-24px;top:-24px;width:48px;height:48px;border-radius:9999px;background:${color};opacity:.2;animation:ping 2s ease-out infinite;"></span>` : ''}
      <span style="position:absolute;left:-12px;top:-12px;width:24px;height:24px;border-radius:9999px;background:${color};box-shadow:0 0 0 3px ${C.white},0 4px 14px rgba(0,0,0,.3);"></span>
      ${label ? `<span style="position:absolute;left:18px;top:-14px;white-space:nowrap;font-size:11px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;background:${C.destination};color:${C.white};padding:4px 10px;border-radius:999px;box-shadow:0 6px 16px rgba(0,0,0,.25);letter-spacing:.02em;">${label}</span>` : ''}
    </div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

function makeWaypoint() {
  return L.divIcon({
    className: '',
    html: `<span style="display:block;width:10px;height:10px;border-radius:9999px;background:${C.route};border:2px solid ${C.white};transform:translate(-50%,-50%);box-shadow:0 2px 6px rgba(0,0,0,.2);"></span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

function FitBounds({ points, padding = 60 }: { points: [number, number][]; padding?: number }) {
  const map = useMap()
  useMemo(() => {
    if (points.length === 0) return
    const bounds = L.latLngBounds(points.map(p => L.latLng(p[0], p[1])))
    map.fitBounds(bounds, { padding: [padding, padding], maxZoom: 8 })
  }, [JSON.stringify(points)])
  return null
}

function AnimatedMarker({ position, icon, children }: { position: [number, number]; icon: L.DivIcon; children?: React.ReactNode }) {
  const markerRef = useRef<L.Marker>(null)
  const posKey = `${position[0].toFixed(5)},${position[1].toFixed(5)}`

  useEffect(() => {
    const mk = markerRef.current
    if (!mk) return
    const current = mk.getLatLng()
    const target = L.latLng(position[0], position[1])
    const dist = current.distanceTo(target)
    if (dist < 1) return

    const startLat = current.lat
    const startLng = current.lng
    const duration = Math.min(2000, Math.max(500, dist * 2))
    const startTime = performance.now()
    let id: number

    function tick(time: number) {
      const t = Math.min((time - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      mk!.setLatLng([startLat + (position[0] - startLat) * ease, startLng + (position[1] - startLng) * ease])
      if (t < 1) id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [posKey])

  return <Marker ref={markerRef} position={position} icon={icon}>{children}</Marker>
}

export function LiveMap({
  origin, destination, current, events,
  originLabel, destinationLabel, currentLabel, currentStatus,
}: {
  origin: [number, number]
  destination: [number, number]
  current: [number, number]
  events?: { lat?: number | null; lng?: number | null; status: string; location_label?: string | null }[]
  originLabel?: string | null
  destinationLabel?: string | null
  currentLabel?: string | null
  currentStatus?: string | null
}) {
  const routePoints = useMemo<[number, number][]>(() => {
    const pts: [number, number][] = [origin]
    if (current[0] !== origin[0] || current[1] !== origin[1]) pts.push(current)
    if (destination[0] !== current[0] || destination[1] !== current[1]) pts.push(destination)
    return pts
  }, [origin, destination, current])

  const allPoints = useMemo(() => {
    const pts: [number, number][] = [origin, current, destination]
    for (const e of events ?? []) {
      if (typeof e.lat === 'number' && typeof e.lng === 'number') pts.push([e.lat, e.lng])
    }
    return pts.filter((p, i, a) => a.findIndex(q => q[0] === p[0] && q[1] === p[1]) === i)
  }, [origin, current, destination, events])

  return (
    <MapContainer className="h-full w-full" style={{ width: '100%', height: '100%', background: '#e8e4df' }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
      />
      <Polyline positions={routePoints} pathOptions={{ color: C.routeDash, weight: 3, dashArray: '10 8', opacity: 0.7 }} />
      <Polyline positions={routePoints} pathOptions={{ color: C.route, weight: 4, opacity: 0.35 }} />

      <Marker position={origin} icon={makeIcon(C.origin, 'Origin')}>
        <Popup>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", padding: '4px 0' }}>
            <strong style={{ color: C.text, fontSize: 14 }}>Origin</strong>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>{originLabel || `${origin[0].toFixed(4)}, ${origin[1].toFixed(4)}`}</p>
          </div>
        </Popup>
      </Marker>

      <Marker position={destination} icon={makeIcon(C.destination, 'Destination')}>
        <Popup>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", padding: '4px 0' }}>
            <strong style={{ color: C.text, fontSize: 14 }}>Destination</strong>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>{destinationLabel || `${destination[0].toFixed(4)}, ${destination[1].toFixed(4)}`}</p>
          </div>
        </Popup>
      </Marker>

      <AnimatedMarker position={current} icon={makeIcon(C.current, currentLabel || 'Current', true)}>
        <Popup>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", padding: '4px 0' }}>
            <strong style={{ color: C.text, fontSize: 14 }}>Current location</strong>
            {currentLabel && <p style={{ margin: '2px 0 0', fontSize: 12, color: C.textMuted }}>{currentLabel}</p>}
            {currentStatus && (
              <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: '#fff5ed', color: C.current }}>{currentStatus}</span>
            )}
            <p style={{ margin: '4px 0 0', fontSize: 11, color: '#6b8a90' }}>{current[0].toFixed(4)}, {current[1].toFixed(4)}</p>
          </div>
        </Popup>
      </AnimatedMarker>

      {events?.filter(e => typeof e.lat === 'number' && typeof e.lng === 'number').map((e, i) => (
        <Marker key={i} position={[e.lat!, e.lng!]} icon={makeWaypoint()}>
          <Popup>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", padding: '2px 0' }}>
              <strong style={{ fontSize: 12, color: C.text }}>{e.location_label || e.status}</strong>
            </div>
          </Popup>
        </Marker>
      ))}

      <FitBounds points={allPoints} />
    </MapContainer>
  )
}
