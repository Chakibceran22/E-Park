"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, Car, Shield, Zap, Camera, Home, Map, User, List, X, Calendar, CheckCircle, XCircle } from "lucide-react"

const ParkingLots = () => {
  const [selectedLot, setSelectedLot] = useState(null)
  const [mapReady, setMapReady] = useState(false)
  const [activeTab, setActiveTab] = useState('map')
  const [showDetails, setShowDetails] = useState(false)

  // Sample reservations data
  const reservations = [
    {
      id: 1,
      lotName: "Parking Grande Poste",
      address: "Boulevard Khemisti, Alger Centre",
      date: "Sep 25, 2025",
      time: "14:00 - 16:00",
      duration: "2 hours",
      price: 400,
      status: "active",
      spotNumber: "A-45"
    },
    {
      id: 2,
      lotName: "Parking Didouche Mourad",
      address: "38 Rue Didouche Mourad, Alger",
      date: "Sep 22, 2025",
      time: "10:00 - 12:30",
      duration: "2.5 hours",
      price: 750,
      status: "completed",
      spotNumber: "B-12"
    },
    {
      id: 3,
      lotName: "Parking Riadh El Feth",
      address: "Riadh El Feth, El Madania",
      date: "Sep 20, 2025",
      time: "09:00 - 11:00",
      duration: "2 hours",
      price: 440,
      status: "completed",
      spotNumber: "C-23"
    }
  ]

  // Real parking locations in Algiers
  const parkingLots = [
    {
      id: 1,
      name: "Parking Grande Poste",
      address: "Boulevard Khemisti, Alger Centre",
      availableSpots: 45,
      totalSpots: 120,
      pricePerHour: 200,
      rating: 4.5,
      distance: "0.3 km",
      features: ["Central Location", "24/7 Access", "Security Cameras"],
      image: "/modern-parking-garage-downtown.jpg",
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
      rating: 4.2,
      distance: "0.5 km",
      features: ["Downtown", "Covered Parking", "Secure"],
      image: "/tafourah-parking.webp",
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
      rating: 4.0,
      distance: "0.8 km",
      features: ["Near Port", "Large Spaces", "Budget Friendly"],
      image: "/metro-station-parking-lot.jpg",
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
      rating: 4.3,
      distance: "18 km",
      features: ["Airport", "Long-term Rates", "Shuttle Service"],
      image: "/airport-parking-garage-shuttle.jpg",
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
      rating: 4.4,
      distance: "2.1 km",
      features: ["Shopping Center", "Security Guard", "EV Charging"],
      image: "/placeholder-4fc7k.png",
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
      rating: 4.8,
      distance: "0.6 km",
      features: ["Premium", "City Center", "Valet Service"],
      image: "/premium-executive-parking-garage.jpg",
      lat: 36.7702,
      lng: 3.0565
    },
  ]

  const getAvailabilityColor = (available, total) => {
    const percentage = (available / total) * 100
    if (percentage > 50) return "bg-blue-500"
    if (percentage > 20) return "bg-sky-400"
    return "bg-indigo-500"
  }

  const getFeatureIcon = (feature) => {
    if (feature.includes("Security") || feature.includes("Camera") || feature.includes("Guard")) return <Shield className="h-3 w-3" />
    if (feature.includes("EV") || feature.includes("Charging")) return <Zap className="h-3 w-3" />
    if (feature.includes("Covered")) return <Camera className="h-3 w-3" />
    return <Car className="h-3 w-3" />
  }

  const handleReserve = (lotId) => {
    // Redirect to the parking lot detail page
    window.location.href = `/parking-lot/${lotId}`
  }

  const handleViewOnMap = (lot) => {
    setSelectedLot(lot)
    setActiveTab('map')
    setShowDetails(true)
  }

  useEffect(() => {
    // Load Leaflet CSS
    const cssLink = document.createElement('link')
    cssLink.rel = 'stylesheet'
    cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
    cssLink.crossOrigin = ''
    document.head.appendChild(cssLink)

    // Load Leaflet JS
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

    // Clear existing map if any
    mapElement.innerHTML = ''
    
    // Create map
    const map = L.map('parking-map', {
      center: [36.7630, 3.0520],
      zoom: 13,
      scrollWheelZoom: true,
      zoomControl: false,
      maxBounds: [[36.5, 2.8], [36.95, 3.3]],
      maxBoundsViscosity: 0.5
    })

    // Add zoom control to bottom right
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map)

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map)

    // Add user location marker with blue pulsing effect
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

    const userMarker = L.marker([36.7630, 3.0520], { icon: userIcon })
      .addTo(map)
      .bindPopup('<b>📍 Your Location</b><br>Alger Centre, Algeria')
    
    userMarker.openPopup()

    // Add parking markers with blue theme
    parkingLots.forEach(lot => {
      const percentage = (lot.availableSpots / lot.totalSpots) * 100
      let color = '#3b82f6' // blue-500
      if (percentage <= 50 && percentage > 20) color = '#0ea5e9' // sky-500
      if (percentage <= 20) color = '#6366f1' // indigo-500

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

      const marker = L.marker([lot.lat, lot.lng], { icon: markerIcon })
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

      marker.on('click', () => {
        setSelectedLot(lot)
        setActiveTab('map')
        map.setView([lot.lat, lot.lng], 15, { animate: true })
      })
    })

    setMapReady(true)
    
    setTimeout(() => {
      map.invalidateSize()
    }, 100)
  }

  const ParkingCard = ({ lot }) => (
    <Card className="shadow-lg border-blue-100">
      <div className="relative">
        <img src={lot.image || "/placeholder.svg"} alt={lot.name} className="w-full h-32 object-cover" />
        <div className="absolute top-2 right-2">
          <Badge className="bg-blue-500 text-white">
            <MapPin className="h-3 w-3 mr-1" />
            {lot.distance}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{lot.name}</CardTitle>
            <CardDescription className="text-xs">{lot.address}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">{lot.pricePerHour} DZD</div>
            <div className="text-xs text-muted-foreground">per hour</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Availability</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(lot.availableSpots, lot.totalSpots)}`}></div>
            <span>{lot.availableSpots}/{lot.totalSpots} spots</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {lot.features.map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs border-blue-200">
              {getFeatureIcon(feature)}
              <span className="ml-1">{feature}</span>
            </Badge>
          ))}
        </div>

        <Button 
          onClick={() => handleReserve(lot.id)} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold" 
          disabled={lot.availableSpots === 0}
        >
          <Clock className="h-4 w-4 mr-2" />
          {lot.availableSpots === 0 ? "Full - No Spots" : "Reserve This Spot"}
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0 z-20">
        <h1 className="text-xl font-bold text-blue-600">E-Park</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden min-h-0">
        {activeTab === 'map' && (
          <>
            <div 
              id="parking-map"
              className="w-full h-full"
            />
            
            {/* Floating details card */}
            {selectedLot && showDetails && (
              <div className="absolute bottom-20 left-0 right-0 px-4 pb-4 animate-in slide-in-from-bottom duration-300">
                <div className="bg-white rounded-2xl shadow-2xl relative">
                  <button 
                    onClick={() => setShowDetails(false)}
                    className="absolute top-3 right-3 z-10 bg-gray-100 rounded-full p-1.5"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <ParkingCard lot={selectedLot} />
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'reservations' && (
          <div className="h-full overflow-y-auto pb-20 px-4 pt-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900">My Reservations</h2>
            
            {reservations.length > 0 ? (
              <div className="space-y-3">
                {reservations.map((reservation) => (
                  <Card key={reservation.id} className="shadow-md border-blue-100">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{reservation.lotName}</CardTitle>
                          <CardDescription className="text-xs">{reservation.address}</CardDescription>
                        </div>
                        <Badge className={reservation.status === 'active' ? 'bg-blue-500' : 'bg-gray-400'}>
                          {reservation.status === 'active' ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            'Completed'
                          )}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Date:</span>
                          <p className="font-medium">{reservation.date}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Time:</span>
                          <p className="font-medium">{reservation.time}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Spot:</span>
                          <p className="font-medium">{reservation.spotNumber}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Duration:</span>
                          <p className="font-medium">{reservation.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-lg font-bold text-blue-600">{reservation.price} DZD</span>
                        {reservation.status === 'active' && (
                          <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                            Cancel
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No reservations yet</p>
                <Button 
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={() => setActiveTab('map')}
                >
                  Find Parking
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="h-full overflow-y-auto pb-20 px-4 pt-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
            </div>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-base">User Name</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-base">user@email.com</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-base">+213 555 123 456</p>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-4 py-2 flex-shrink-0 z-20">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'map' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Map className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">Map</span>
          </button>
          
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'reservations' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Calendar className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">Bookings</span>
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'profile' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <User className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default ParkingLots