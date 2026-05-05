import { useEffect, useRef, useState } from 'react'
import { getSupermarkets } from '../apis/products'

interface Supermarket {
  id: number
  name: string
  address: string
  lat: number
  lng: number
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export default function StoreMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([])
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    getSupermarkets()
      .then(setSupermarkets)
      .catch((err) => console.error('Failed to fetch supermarkets:', err))
  }, [])

  useEffect(() => {
    // If google is available and we have supermarkets, init map
    if (window.google && window.google.maps && mapRef.current && supermarkets.length > 0) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -36.8485, lng: 174.7633 }, // Default to Auckland CBD
        zoom: 11,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      })

      const bounds = new window.google.maps.LatLngBounds()

      supermarkets.forEach((store) => {
        const marker = new window.google.maps.Marker({
          position: { lat: store.lat, lng: store.lng },
          map,
          title: store.name,
          icon: {
            url: store.name.toLowerCase().includes('pak') 
              ? '/images/pak-n-save.webp' 
              : store.name.toLowerCase().includes('new') 
                ? '/images/new-world.webp' 
                : '/images/woolworths.webp',
            scaledSize: new window.google.maps.Size(30, 30),
          }
        })

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="color: #1a2e35; padding: 5px;">
                      <h4 style="margin: 0; font-weight: bold;">${store.name}</h4>
                      <p style="margin: 5px 0 0; font-size: 12px;">${store.address}</p>
                    </div>`,
        })

        marker.addListener('click', () => {
          infoWindow.open(map, marker)
        })

        bounds.extend({ lat: store.lat, lng: store.lng })
      })

      if (supermarkets.length > 1) {
        map.fitBounds(bounds)
      }
    } else if (!window.google) {
      // Check for script presence, if not there, it's an error/missing key
      const script = document.querySelector('script[src*="maps.googleapis.com"]')
      if (!script) {
        setMapError(true)
      }
    }
  }, [supermarkets])

  return (
    <div className="w-full h-full relative bg-gray-50">
      <div ref={mapRef} className="w-full h-full" />
      
      {(mapError || !window.google) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gray-100/80 backdrop-blur-[2px]">
          <div className="text-3xl mb-3">📍</div>
          <p className="text-kiwi-dark font-bold text-sm">
            Map Integration Ready
          </p>
          <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest leading-relaxed">
            Please add your Google Maps API key <br /> to index.html to activate
          </p>
          
          <div className="mt-4 flex gap-2">
            {supermarkets.slice(0, 3).map(s => (
              <div key={s.id} className="w-2 h-2 rounded-full bg-kiwi animate-pulse" title={s.name} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
