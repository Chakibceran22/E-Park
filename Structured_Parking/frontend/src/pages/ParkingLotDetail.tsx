"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Navigation, MapPin, Clock, Car } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
const ParkingLotDetail = () => {
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null)
  const [reservedSpots, setReservedSpots] = useState<Set<string>>(new Set())
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [parkingSpaces, setParkingSpaces] = useState<any[]>([])
  const navigate = useNavigate()
  const parkingLot = {
    id: 1,
    name: "Downtown Plaza Parking",
    address: "123 Main Street, Downtown",
    pricePerHalfHour: 100,
    totalSpots: 120,
    availableSpots: 45,
  }

  const calculateTotalCost = () => {
    if (!startTime || !endTime) return 0
    const start = new Date(`${selectedDate}T${startTime}`)
    const end = new Date(`${selectedDate}T${endTime}`)
    const minutes = (end.getTime() - start.getTime()) / (1000 * 60)
    const halfHours = Math.ceil(minutes / 30)
    return Math.max(halfHours, 1) * parkingLot.pricePerHalfHour
  }

  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        options.push(timeString)
      }
    }
    return options
  }

  const isValidTimeSelection = () => {
    if (!startTime || !endTime) return false
    const start = new Date(`${selectedDate}T${startTime}`)
    const end = new Date(`${selectedDate}T${endTime}`)
    return end > start
  }

  const generateParkingSpaces = () => {
    const spaces = []
    const rows = ["A", "B", "C", "D", "E", "F"]
    const spotsPerRow = 20

    for (const row of rows) {
      for (let spot = 1; spot <= spotsPerRow; spot++) {
        const spaceId = `${row}${spot.toString().padStart(2, "0")}`
        const isAvailable = Math.random() > 0.4

        spaces.push({
          id: spaceId,
          row,
          number: spot,
          isAvailable,
          x: (spot - 1) * 40 + 20,
          y: rows.indexOf(row) * 60 + 30,
        })
      }
    }
    return spaces
  }

  useEffect(() => {
    setParkingSpaces(generateParkingSpaces())
  }, [])

  useEffect(() => {
    // Simulate real-time changes every 2-4 seconds
    const interval = setInterval(() => {
      setParkingSpaces(prevSpaces => {
        if (prevSpaces.length === 0) return prevSpaces
        
        const newSpaces = [...prevSpaces]
        // Randomly change 2-5 spots
        const numChanges = Math.floor(Math.random() * 4) + 2
        
        for (let i = 0; i < numChanges; i++) {
          const randomIndex = Math.floor(Math.random() * newSpaces.length)
          const spot = newSpaces[randomIndex]
          
          // Don't change selected or reserved spots
          if (spot && spot.id !== selectedSpot && !reservedSpots.has(spot.id)) {
            newSpaces[randomIndex] = {
              ...spot,
              isAvailable: Math.random() > 0.5
            }
          }
        }
        
        return newSpaces
      })
    }, 2000 + Math.random() * 2000) // 2-4 seconds

    return () => clearInterval(interval)
  }, [selectedSpot, reservedSpots])

  const getSpaceColor = (space: any) => {
    if (!space) return "bg-gray-100 border-gray-300"
    if (reservedSpots.has(space.id)) return "bg-blue-500 border-blue-600 text-white"
    if (space.id === selectedSpot) return "bg-blue-500 border-blue-600 text-white"
    if (!space.isAvailable) return "bg-red-200 border-red-300"
    return "bg-gray-100 border-gray-300 hover:bg-blue-100"
  }

  const handleSpotSelect = (spaceId: string) => {
    const space = parkingSpaces.find((s) => s.id === spaceId)
    if (space?.isAvailable && !reservedSpots.has(spaceId)) {
      setSelectedSpot(spaceId)
    }
  }

  const handleReservation = async() => {
    if (selectedSpot && isValidTimeSelection()) {
      setReservedSpots(prev => new Set([...prev, selectedSpot]))
      const reserveInformations = {
        parkingSpot: selectedSpot,
        date: selectedDate,
        startTime,
        endTime,
        location: parkingLot.address,
      }
      localStorage.setItem("reserveInformations", JSON.stringify(reserveInformations))
      try {
        const urlResponse =await axios.post("http://localhost:3000/initiate-payment", {
        amount: calculateTotalCost().toString()
        
      })
      window.location.href = urlResponse.data.url
      } catch (error) {
        console.log(error)
        toast.error("Payment failed. Please try again.")
      }
      
    }
  }

 

  const selectedSpace = parkingSpaces.find((s) => s.id === selectedSpot)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                E-Park
              </h1>
            </div>
            <Button variant="ghost" size="sm">
              <span className="text-sm">Profile</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">{parkingLot.name}</h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-gray-600 mb-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{parkingLot.address}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">{parkingLot.pricePerHalfHour} DZD/30min</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span className="text-xs sm:text-sm">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-200 border border-red-300 rounded"></div>
              <span className="text-xs sm:text-sm">Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 border border-blue-600 rounded"></div>
              <span className="text-xs sm:text-sm">Selected/Reserved</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="order-2 lg:order-1 lg:col-span-3">
            <Card className="p-3 sm:p-6">
              <CardHeader className="px-0 pt-0 pb-3 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Parking Layout</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="relative bg-gray-50 rounded-lg p-2 sm:p-4 overflow-x-auto">
                  <div className="absolute top-1 sm:top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium">
                    ENTRANCE
                  </div>
                  <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium">
                    EXIT
                  </div>

                  <div className="mt-6 sm:mt-8 mb-6 sm:mb-8 min-w-max">
                    {["A", "B", "C", "D", "E", "F"].map((row) => (
                      <div key={row} className="flex items-center mb-2 sm:mb-4">
                        <div className="w-6 sm:w-8 text-center font-bold text-sm sm:text-lg mr-2 sm:mr-4">{row}</div>
                        <div className="flex space-x-0.5 sm:space-x-1">
                          {Array.from({ length: 20 }, (_, spotIndex) => {
                            const spaceId = `${row}${(spotIndex + 1).toString().padStart(2, "0")}`
                            const space = parkingSpaces.find((s) => s.id === spaceId)
                            return (
                              <button
                                key={spaceId}
                                onClick={() => handleSpotSelect(spaceId)}
                                disabled={!space?.isAvailable || reservedSpots.has(spaceId)}
                                className={`w-6 h-8 sm:w-8 sm:h-12 border-2 rounded text-xs font-medium transition-all duration-300 ${getSpaceColor(space)} ${
                                  space?.isAvailable && !reservedSpots.has(spaceId) ? "cursor-pointer" : "cursor-not-allowed"
                                }`}
                                title={`Space ${spaceId}`}
                              >
                                <span className="hidden sm:inline">{spotIndex + 1}</span>
                                <span className="sm:hidden text-xs">{spotIndex + 1}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-1">
            <Card className="lg:sticky lg:top-24">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Reservation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {selectedSpot ? (
                  <>
                    <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">Space {selectedSpot}</div>
                    </div>

                    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm sm:text-base">Select Date & Time</h4>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">Date</label>
                        <input
                          type="date"
                          value={selectedDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-1">From</label>
                          <select
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                          >
                            <option value="">Select time</option>
                            {generateTimeOptions().map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-1">To</label>
                          <select
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                          >
                            <option value="">Select time</option>
                            {generateTimeOptions().map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {startTime && endTime && isValidTimeSelection() && (
                        <div className="text-center p-2 bg-green-50 rounded border border-green-200">
                          <div className="text-xs sm:text-sm text-green-700">
                            Duration:{" "}
                            {(() => {
                              const minutes = (new Date(`${selectedDate}T${endTime}`).getTime() -
                                new Date(`${selectedDate}T${startTime}`).getTime()) / (1000 * 60)
                              const hours = Math.floor(minutes / 60)
                              const mins = Math.round(minutes % 60)
                              return hours > 0 ? `${hours}h ${mins}min` : `${mins} min`
                            })()}
                          </div>
                          <div className="font-bold text-green-800 text-sm sm:text-base">
                            Total: {calculateTotalCost()} DZD
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Rate:</span>
                        <span className="font-medium">{parkingLot.pricePerHalfHour} DZD/30min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="font-medium">Row {selectedSpace?.row}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      

                      <Button 
                        className="w-full text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
                        disabled={!isValidTimeSelection()}
                        onClick={handleReservation}
                      >
                        <Car className="h-4 w-4 mr-2" />
                        <span className="truncate">
                          Reserve {selectedSpot}
                          {isValidTimeSelection() && ` - ${calculateTotalCost()} DZD`}
                        </span>
                      </Button>
                    </div>

                    
                  </>
                ) : (
                  <div className="text-center p-6 sm:p-8 text-gray-500">
                    <Car className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm sm:text-base">Select an available parking space to continue</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ParkingLotDetail