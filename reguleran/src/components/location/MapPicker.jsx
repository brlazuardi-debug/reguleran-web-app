import { useEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'
import { Card } from '../ui/Card'

export default function MapPicker({ lat, lng, onLocationChange, readonly = false }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const initMap = async () => {
      const L = await import('leaflet')

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current, {
          center: [lat || -6.2088, lng || 106.8456],
          zoom: 13,
          zoomControl: !readonly,
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapInstanceRef.current)
      }

      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current)
      }

      if (lat && lng) {
        markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current)
      }

      if (!readonly) {
        mapInstanceRef.current.on('click', (e) => {
          const { lat: newLat, lng: newLng } = e.latlng
          if (markerRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current)
          }
          markerRef.current = L.marker([newLat, newLng]).addTo(mapInstanceRef.current)
          onLocationChange?.({ lat: newLat, lng: newLng })
        })
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [lat, lng, readonly, onLocationChange])

  return <div ref={mapRef} className="w-full h-[300px] rounded-xl border border-stone-300 dark:border-stone-700 z-0" />
}

export function LocationCard({ location }) {
  if (!location) return null

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={16} className="text-stone-500 dark:text-stone-400" />
        <h4 className="font-semibold text-sm text-stone-700 dark:text-stone-300">Lokasi</h4>
      </div>
      {location.venue && (
        <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{location.venue}</p>
      )}
      {location.address && (
        <p className="text-sm text-stone-500 dark:text-stone-400">{location.address}</p>
      )}
      {location.lat && location.lng && (
        <div className="mt-3">
          <MapPicker lat={location.lat} lng={location.lng} readonly />
        </div>
      )}
      {!location.venue && !location.address && !location.lat && (
        <p className="text-sm text-stone-400 dark:text-stone-500 italic">Tidak ada lokasi</p>
      )}
    </Card>
  )
}
