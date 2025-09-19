"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, Car, Shield, Zap, Camera } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ParkingLots = () => {
  const parkingLots = [
    {
      id: 1,
      name: "Downtown Plaza Parking",
      address: "123 Main Street, Downtown",
      availableSpots: 45,
      totalSpots: 120,
      pricePerHour: 200,
      rating: 4.5,
      distance: "0.2 miles",
      features: ["Security Cameras", "24/7 Access", "EV Charging"],
      image: "/modern-parking-garage-downtown.jpg",
    },
    {
      id: 2,
      name: "City Center Garage",
      address: "456 Business Ave, City Center",
      availableSpots: 23,
      totalSpots: 80,
      pricePerHour: 300,
      rating: 4.2,
      distance: "0.5 miles",
      features: ["Covered Parking", "Security Guard", "Valet Service"],
      image: "/covered-parking-garage-city-center.jpg",
    },
    {
      id: 3,
      name: "Metro Station Lot",
      address: "789 Transit Way, Metro District",
      availableSpots: 67,
      totalSpots: 150,
      pricePerHour: 150,
      rating: 4.0,
      distance: "0.8 miles",
      features: ["Near Metro", "Budget Friendly", "Large Spaces"],
      image: "/metro-station-parking-lot.jpg",
    },
    {
      id: 4,
      name: "Premium Executive Parking",
      address: "321 Corporate Blvd, Business District",
      availableSpots: 12,
      totalSpots: 50,
      pricePerHour: 400,
      rating: 4.8,
      distance: "1.2 miles",
      features: ["Luxury Service", "Car Wash", "Concierge"],
      image: "/premium-executive-parking-garage.jpg",
    },
    {
      id: 5,
      name: "University Campus Parking",
      address: "555 College Ave, University Area",
      availableSpots: 89,
      totalSpots: 200,
      pricePerHour: 100,
      rating: 3.8,
      distance: "2.1 miles",
      features: ["Student Discount", "Monthly Passes", "Bike Racks"],
      image: "/placeholder-4fc7k.png",
    },
    {
      id: 6,
      name: "Airport Express Parking",
      address: "777 Airport Rd, Terminal Area",
      availableSpots: 156,
      totalSpots: 300,
      pricePerHour: 250,
      rating: 4.3,
      distance: "5.2 miles",
      features: ["Shuttle Service", "Long-term Rates", "Online Booking"],
      image: "/airport-parking-garage-shuttle.jpg",
    },
  ]

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100
    if (percentage > 50) return "bg-green-500"
    if (percentage > 20) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getFeatureIcon = (feature: string) => {
    if (feature.includes("Security") || feature.includes("Camera")) return <Camera className="h-4 w-4" />
    if (feature.includes("EV") || feature.includes("Charging")) return <Zap className="h-4 w-4" />
    if (feature.includes("Guard") || feature.includes("24/7")) return <Shield className="h-4 w-4" />
    return <Car className="h-4 w-4" />
  }
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
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
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Find Your Perfect</span>
            <br />
            <span className="text-foreground">Parking Spot</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from available parking lots near you. Real-time availability and instant reservations.
          </p>
        </div>

        {/* Parking Lots Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parkingLots.map((lot) => (
            <Card key={lot.id} className="shadow-brand hover:shadow-glow transition-smooth overflow-hidden">
              <div className="relative">
                <img src={lot.image || "/placeholder.svg"} alt={lot.name} className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {lot.distance}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{lot.rating}</span>
                  </div>
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
                {/* Availability */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Availability</span>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${getAvailabilityColor(lot.availableSpots, lot.totalSpots)}`}
                    ></div>
                    <span className="text-sm">
                      {lot.availableSpots}/{lot.totalSpots} spots
                    </span>
                  </div>
                </div>

                {/* Features */}
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

                {/* Reserve Button */}
                <Button onClick={() => navigate('/parking-lot/1')} className="w-full" variant="auth" disabled={lot.availableSpots === 0}>
                  <Clock className="h-4 w-4 mr-2" />
                  {lot.availableSpots === 0 ? "Full" : "Reserve Now"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

export default ParkingLots
