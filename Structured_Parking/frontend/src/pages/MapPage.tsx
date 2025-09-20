import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Map, Calendar, User } from 'lucide-react'

const MapPage = () => {
  const location = useLocation()
  const [mapReady, setMapReady] = useState(false)

  const parkingLots = [
    {
      id: 1,
      name: "Parking Grande Poste",
      address: "Boulevard Khemisti, Alger Centre",
      availableSpots: 45,
      totalSpots: 120,
      pricePerHour: 200,
      distance: "0.3 km",
      lat: 36.7666,
      lng: 3.0583
    },
    {
      id: 2,
      name: "Parking Tafoura",
      address: "Rue d'Angkor, Alger Centre",
      availableSpots: 23,
      totalSpots: 80,
      pricePerHour: 150,
      distance: "0.5 km",
      lat: 36.7638,
      lng: 3.0547
    },
    {
      id: 3,
      name: "Parking Port d'Alger",
      address: "Boulevard Zighoud Youcef, Port",
      availableSpots: 67,
      totalSpots: 150,
      pricePerHour: 180,
      distance: "0.8 km",
      lat: 36.7685,
      lng: 3.0608
    },
    {
      id: 4,
      name: "Parking Aéroport Houari Boumediene",
      address: "Aéroport Houari Boumediene",
      availableSpots: 156,
      totalSpots: 300,
      pricePerHour: 250,
      distance: "18 km",
      lat: 36.6918,
      lng: 3.2154
    },
    {
      id: 5,
      name: "Parking Riadh El Feth",
      address: "Riadh El Feth, El Madania",
      availableSpots: 89,
      totalSpots: 200,
      pricePerHour: 220,
      distance: "2.1 km",
      lat: 36.7478,
      lng: 3.0594
    },
    {
      id: 6,
      name: "Parking Didouche Mourad",
      address: "38 Rue Didouche Mourad, Alger",
      availableSpots: 12,
      totalSpots: 50,
      pricePerHour: 300,
      distance: "0.6 km",
      lat: 36.7702,
      lng: 3.0565
    },
  ]

  useEffect(() => {
    const cssLink = document.createElement('link')
    cssLink.rel = 'stylesheet'
    cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
    cssLink.crossOrigin = ''
    document.head.appendChild(cssLink)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
    script.crossOrigin = ''
    
    script.onload = () => {
      setTimeout(() => {
        if (window.L && document.getElementById('parking-map')) {
          initMap()
        }
      }, 100)
    }
    
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
      if (document.head.contains(cssLink)) {
        document.head.removeChild(cssLink)
      }
    }
  }, [])

  const initMap = () => {
    const L = window.L
    const mapElement = document.getElementById('parking-map')
    
    if (!mapElement) return
    mapElement.innerHTML = ''
    
    const map = L.map('parking-map', {
      center: [36.7630, 3.0520],
      zoom: 13,
      scrollWheelZoom: true,
      zoomControl: false,
      maxBounds: [[36.5, 2.8], [36.95, 3.3]],
      maxBoundsViscosity: 0.5
    })

    L.control.zoom({ position: 'bottomright' }).addTo(map)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map)

    const userIcon = L.divIcon({
      html: `
        <div style="position: relative;">
          <div style="
            background-color: #3b82f6;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 4px solid white;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 0 20px rgba(59, 130, 246, 0.6);
            animation: pulse 2s infinite;
          "></div>
          <style>
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
          </style>
        </div>
      `,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })

    L.marker([36.7630, 3.0520], { icon: userIcon })
      .addTo(map)
      .bindPopup('<b>📍 Your Location</b><br>Alger Centre, Algeria')
      .openPopup()

    parkingLots.forEach(lot => {
      const percentage = (lot.availableSpots / lot.totalSpots) * 100
      let color = '#3b82f6'
      if (percentage <= 50 && percentage > 20) color = '#0ea5e9'
      if (percentage <= 20) color = '#6366f1'

      const markerIcon = L.divIcon({
        html: `
          <div style="
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 3px 8px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 14px;">P</div>
          </div>
        `,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      })

      L.marker([lot.lat, lot.lng], { icon: markerIcon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 220px; font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="font-weight: bold; margin: 0 0 8px 0; font-size: 15px;">${lot.name}</h3>
            <p style="color: #666; font-size: 12px; margin: 0 0 8px 0;">${lot.address}</p>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 13px;">
              <span>Availability:</span>
              <span style="font-weight: 600;">${lot.availableSpots}/${lot.totalSpots}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 13px;">
              <span>Price:</span>
              <span style="font-weight: 600; color: #3b82f6;">${lot.pricePerHour} DZD/h</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px;">
              <span>Distance:</span>
              <span style="font-weight: 600;">${lot.distance}</span>
            </div>
            <button 
              onclick="window.location.href='/parking-lot/${lot.id}'"
              style="
                width: 100%;
                background-color: ${lot.availableSpots === 0 ? '#9ca3af' : '#3b82f6'};
                color: white;
                border: none;
                padding: 10px 16px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
                cursor: ${lot.availableSpots === 0 ? 'not-allowed' : 'pointer'};
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
              "
              ${lot.availableSpots === 0 ? 'disabled' : ''}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              ${lot.availableSpots === 0 ? 'Full - No Spots' : 'Reserve Now'}
            </button>
          </div>
        `)
    })

    setMapReady(true)
    setTimeout(() => map.invalidateSize(), 100)
  }

  const navItems = [
    { path: '/', icon: Map, label: 'Map' },
    { path: '/reservations', icon: Calendar, label: 'Bookings' },
    { path: '/profile', icon: User, label: 'Profile' }
  ]

  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0 z-20">
        <h1 className="text-xl font-bold text-blue-600">E-Park</h1>
      </header>

      <main className="flex-1 relative overflow-hidden min-h-0">
        <div id="parking-map" className="w-full h-full" />
      </main>

      <nav className="bg-white border-t border-gray-200 px-4 py-2 flex-shrink-0 z-20">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                location.pathname === item.path ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default MapPage