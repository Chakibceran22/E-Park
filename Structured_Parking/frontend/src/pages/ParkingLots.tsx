"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, Car, Shield, Zap, Camera } from "lucide-react"

const ParkingLots = () => {
  const [selectedLot, setSelectedLot] = useState(null)
  const [mapReady, setMapReady] = useState(false)

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
      image: "../../public/tafourah-parking.webp",
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
    if (percentage > 50) return "bg-green-500"
    if (percentage > 20) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getFeatureIcon = (feature) => {
    if (feature.includes("Security") || feature.includes("Camera") || feature.includes("Guard")) return <Shield className="h-4 w-4" />
    if (feature.includes("EV") || feature.includes("Charging")) return <Zap className="h-4 w-4" />
    if (feature.includes("Covered")) return <Camera className="h-4 w-4" />
    return <Car className="h-4 w-4" />
  }

  const handleReserve = (lotId) => {
    window.location.href = `/parking-lot/${lotId}`
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
      zoom: 14,
      scrollWheelZoom: true
    })

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map)

    // Add LARGE user location marker with pulsing effect
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
    
    // Open popup immediately
    userMarker.openPopup()

    // Add parking markers
    parkingLots.forEach(lot => {
      const percentage = (lot.availableSpots / lot.totalSpots) * 100
      let color = '#22c55e'
      if (percentage <= 50 && percentage > 20) color = '#eab308'
      if (percentage <= 20) color = '#ef4444'

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
          <div style="min-width: 200px; font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="font-weight: bold; margin: 0 0 8px 0; font-size: 15px;">${lot.name}</h3>
            <p style="color: #666; font-size: 12px; margin: 0 0 8px 0;">${lot.address}</p>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 13px;">
              <span>Availability:</span>
              <span style="font-weight: 600;">${lot.availableSpots}/${lot.totalSpots}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 13px;">
              <span>Price:</span>
              <span style="font-weight: 600; color: #7c3aed;">${lot.pricePerHour} DZD/h</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px;">
              <span>Distance:</span>
              <span style="font-weight: 600;">${lot.distance}</span>
            </div>
          </div>
        `)

      marker.on('click', () => {
        setSelectedLot(lot)
        map.setView([lot.lat, lot.lng], 15, { animate: true })
      })
    })

    setMapReady(true)
    
    // Invalidate size to ensure proper rendering
    setTimeout(() => {
      map.invalidateSize()
    }, 100)
  }

  const ParkingCard = ({ lot }) => (
    <Card className="shadow-brand hover:shadow-glow transition-smooth overflow-hidden">
      <div className="relative">
        <img src={lot.image || "/placeholder.svg"} alt={lot.name} className="w-full h-48 object-cover" />
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/90 text-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            {lot.distance}
          </Badge>
        </div>
        
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{lot.name}</CardTitle>
            <CardDescription className="text-sm">{lot.address}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{lot.pricePerHour} DZD</div>
            <div className="text-xs text-muted-foreground">per hour</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Availability</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(lot.availableSpots, lot.totalSpots)}`}></div>
            <span className="text-sm">{lot.availableSpots}/{lot.totalSpots} spots</span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium">Features</span>
          <div className="flex flex-wrap gap-1">
            {lot.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {getFeatureIcon(feature)}
                <span className="ml-1">{feature}</span>
              </Badge>
            ))}
          </div>
        </div>

        <Button 
          onClick={() => handleReserve(lot.id)} 
          className="w-full" 
          variant="auth" 
          disabled={lot.availableSpots === 0}
        >
          <Clock className="h-4 w-4 mr-2" />
          {lot.availableSpots === 0 ? "Full" : "Reserve Now"}
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-white/80 backdrop-blur-sm border-b border-accent sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">E-Park</h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/profile")}>
                Profile
              </Button>
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Find Your Perfect</span>
            <br />
            <span className="text-foreground">Parking Spot</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Choose from available parking lots near you in Algiers. Real-time availability and instant reservations.
          </p>
        </div>

        <div className="space-y-6">
          <div 
            id="parking-map"
            className="w-full h-[500px] md:h-[600px] rounded-xl shadow-brand overflow-hidden border-2 border-gray-200"
          />
          
          <div className="text-center text-sm text-muted-foreground">
            <p>🔵 Your Location | 📍 Parking Lots (Green = Available, Yellow = Limited, Red = Almost Full)</p>
          </div>
          
          {selectedLot && (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-bold mb-4 text-center">Selected Parking Lot</h3>
              <ParkingCard lot={selectedLot} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ParkingLots