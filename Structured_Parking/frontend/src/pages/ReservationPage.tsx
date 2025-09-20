import { Link, useLocation } from 'react-router-dom'
import { Map, Calendar, User, CheckCircle, QrCode } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'

const ReservationsPage = () => {
  const location = useLocation()
  const [selectedQR, setSelectedQR] = useState(null)

  const reservations = [
    {
      id: 1,
      lotName: "Parking Grande Poste",
      address: "Boulevard Khemisti, Alger Centre",
      date: "Sep 20, 2025",
      time: "14:00 - 16:00",
      duration: "2 hours",
      price: 400,
      status: "active",
      spotNumber: "B-07"
    },
    {
      id: 2,
      lotName: "Parking Didouche Mourad",
      address: "38 Rue Didouche Mourad, Alger",
      date: "Sep 12, 2025",
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
      date: "Sep 09, 2025",
      time: "09:00 - 11:00",
      duration: "2 hours",
      price: 440,
      status: "completed",
      spotNumber: "C-23"
    }
  ]

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

      <main className="flex-1 overflow-y-auto pb-20 px-4 pt-4">
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
                    <div className="flex gap-2">
                      {reservation.status === 'active' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            onClick={() => setSelectedQR(selectedQR === reservation.id ? null : reservation.id)}
                          >
                            <QrCode className="h-4 w-4 mr-1" />
                            QR
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* QR Code Display */}
                  {selectedQR === reservation.id && reservation.status === 'active' && (
                    <div className="pt-3 border-t mt-3">
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm font-medium text-gray-700 mb-3">Scan at parking entrance</p>
                        <div className="flex justify-center mb-2">
                          <QRCodeSVG 
                            value={JSON.stringify({
                              reservationId: reservation.id,
                              spot: reservation.spotNumber,
                              date: reservation.date,
                              time: reservation.time,
                              location: reservation.lotName
                            })}
                            size={180}
                            level="H"
                            includeMargin={true}
                          />
                        </div>
                        <p className="text-xs text-gray-500">Reservation #{reservation.id}</p>
                      </div>
                    </div>
                  )}
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
              onClick={() => window.location.href = '/'}
            >
              Find Parking
            </Button>
          </div>
        )}
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

export default ReservationsPage