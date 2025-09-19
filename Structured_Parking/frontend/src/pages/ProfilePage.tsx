"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, MapPin, Clock, Calendar, ArrowLeft } from "lucide-react"

const Profile = () => {
  const userInfo = {
    name: "Ahmed Benali",
    email: "ahmed.benali@email.com",
    phone: "+213 555 123 456",
    memberSince: "January 2024",
    totalReservations: 24,
    favoriteLocation: "Downtown Plaza Parking",
  }

  const reservations = [
    {
      id: 1,
      parkingLot: "Downtown Plaza Parking",
      address: "123 Main Street, Downtown",
      date: "2024-01-15",
      time: "09:00 - 17:00",
      duration: "8 hours",
      cost: 1600,
      status: "Active",
      spotNumber: "A-15",
    },
    {
      id: 2,
      parkingLot: "City Center Garage",
      address: "456 Business Ave, City Center",
      date: "2024-01-12",
      time: "14:00 - 18:00",
      duration: "4 hours",
      cost: 1200,
      status: "Completed",
      spotNumber: "B-08",
    },
    {
      id: 3,
      parkingLot: "Metro Station Lot",
      address: "789 Transit Way, Metro District",
      date: "2024-01-10",
      time: "08:30 - 12:30",
      duration: "4 hours",
      cost: 600,
      status: "Completed",
      spotNumber: "C-22",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Completed":
        return "bg-gray-500"
      case "Cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-accent sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/main")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">E-Park</h1>
            </div>
            <Button variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">My Profile</h2>
            <p className="text-muted-foreground">Manage your account and view your parking history</p>
          </div>

          {/* User Information Card */}
          <Card className="shadow-brand">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-lg">{userInfo.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg">{userInfo.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-lg">{userInfo.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                  <p className="text-lg">{userInfo.memberSince}</p>
                </div>
              </div>
              <Separator />
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Reservations</label>
                  <p className="text-2xl font-bold text-primary">{userInfo.totalReservations}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Favorite Location</label>
                  <p className="text-lg">{userInfo.favoriteLocation}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reservations History */}
          <Card className="shadow-brand">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>My Reservations</span>
              </CardTitle>
              <CardDescription>Your recent parking reservations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <Card key={reservation.id} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{reservation.parkingLot}</h4>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {reservation.address}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(reservation.status)} text-white`}>
                          {reservation.status}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <label className="font-medium text-muted-foreground">Date</label>
                          <p className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {reservation.date}
                          </p>
                        </div>
                        <div>
                          <label className="font-medium text-muted-foreground">Time</label>
                          <p className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {reservation.time}
                          </p>
                        </div>
                        <div>
                          <label className="font-medium text-muted-foreground">Spot</label>
                          <p className="font-mono">{reservation.spotNumber}</p>
                        </div>
                        <div>
                          <label className="font-medium text-muted-foreground">Total Cost</label>
                          <p className="font-bold text-primary">{reservation.cost} DZD</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="auth" onClick={() => (window.location.href = "/main")}>
              Find Parking
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
