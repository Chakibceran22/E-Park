"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Clock,
  Car,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const ParkingLotDetail = () => {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [reservedSpots, setReservedSpots] = useState(new Set());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [parkingSpaces, setParkingSpaces] = useState([]);
  
  const parkingLot = {
    id: 1,
    name: "Parking Grande Poste",
    address: "Boulevard Khemisti, Alger Centre",
    pricePerHalfHour: 100,
    totalSpots: 120,
    availableSpots: 45,
  };

  const calculateTotalCost = () => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`${selectedDate}T${startTime}`);
    const end = new Date(`${selectedDate}T${endTime}`);
    const minutes = (end.getTime() - start.getTime()) / (1000 * 60);
    const halfHours = Math.ceil(minutes / 30);
    return Math.max(halfHours, 1) * parkingLot.pricePerHalfHour;
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const isValidTimeSelection = () => {
    if (!startTime || !endTime) return false;
    const start = new Date(`${selectedDate}T${startTime}`);
    const end = new Date(`${selectedDate}T${endTime}`);
    return end > start;
  };

  const generateParkingSpaces = () => {
    const spaces = [];
    const rows = ["A", "B", "C", "D", "E", "F"];
    const spotsPerRow = 20;

    for (const row of rows) {
      for (let spot = 1; spot <= spotsPerRow; spot++) {
        const spaceId = `${row}${spot.toString().padStart(2, "0")}`;
        const isAvailable = Math.random() > 0.4;

        spaces.push({
          id: spaceId,
          row,
          number: spot,
          isAvailable,
          x: (spot - 1) * 40 + 20,
          y: rows.indexOf(row) * 60 + 30,
        });
      }
    }
    return spaces;
  };

  useEffect(() => {
    setParkingSpaces(generateParkingSpaces());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParkingSpaces((prevSpaces) => {
        if (prevSpaces.length === 0) return prevSpaces;

        const newSpaces = [...prevSpaces];
        const numChanges = Math.floor(Math.random() * 4) + 2;

        for (let i = 0; i < numChanges; i++) {
          const randomIndex = Math.floor(Math.random() * newSpaces.length);
          const spot = newSpaces[randomIndex];

          if (spot && spot.id !== selectedSpot && !reservedSpots.has(spot.id)) {
            newSpaces[randomIndex] = {
              ...spot,
              isAvailable: Math.random() > 0.5,
            };
          }
        }

        return newSpaces;
      });
    }, 2000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [selectedSpot, reservedSpots]);

  const getSpaceColor = (space) => {
    if (!space) return "bg-gray-100 border-gray-300";
    if (reservedSpots.has(space.id))
      return "bg-blue-500 border-blue-600 text-white";
    if (space.id === selectedSpot)
      return "bg-blue-500 border-blue-600 text-white";
    if (!space.isAvailable) return "bg-gray-300 border-gray-400 text-gray-500";
    return "bg-white border-gray-300 hover:border-blue-400";
  };

  const handleSpotSelect = (spaceId) => {
    const space = parkingSpaces.find((s) => s.id === spaceId);
    if (space?.isAvailable && !reservedSpots.has(spaceId)) {
      setSelectedSpot(spaceId);
    }
  };

  const handleReservation = async () => {
    if (selectedSpot && isValidTimeSelection()) {
      setReservedSpots((prev) => new Set([...prev, selectedSpot]));
      const reserveInformations = {
        parkingSpot: selectedSpot,
        date: selectedDate,
        startTime,
        endTime,
        location: parkingLot.address,
      };
      localStorage.setItem(
        "reserveInformations",
        JSON.stringify(reserveInformations)
      );
      try {
        setIsProcessing(true);
        const urlResponse = await axios.post(
          "http://localhost:3000/initiate-payment",
          {
            amount: calculateTotalCost().toString(),
          }
        );
        window.location.href = urlResponse.data.url;
      } catch (error) {
        console.log(error);
        toast.error("Payment failed. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.location.href = '/'}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{parkingLot.name}</h1>
              <p className="text-xs text-gray-500 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {parkingLot.address}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-32">
        {/* Time Selection Card */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Select Date & Time</h3>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Starting hour
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
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
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Leaving hour
              </label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
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
        </div>

        {/* Parking Occupancy */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Parking Occupancy</h3>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            

            <div className="space-y-3 overflow-x-auto">
              {["Row 1", "Row 2", "Row 3", "Row 4", "Row 5"].map((row, rowIndex) => (
                <div key={row}>
                  <div className="text-xs font-medium text-blue-600 mb-1.5">{row}</div>
                  <div className="flex space-x-1.5">
                    {Array.from({ length: 10 }, (_, spotIndex) => {
                      const spaceId = `${String.fromCharCode(65 + rowIndex)}${(spotIndex + 1)
                        .toString()
                        .padStart(2, "0")}`;
                      const space = parkingSpaces.find((s) => s.id === spaceId);
                      return (
                        <button
                          key={spaceId}
                          onClick={() => handleSpotSelect(spaceId)}
                          disabled={!space?.isAvailable || reservedSpots.has(spaceId)}
                          className={`w-9 h-9 border-2 rounded-lg transition-all duration-300 flex items-center justify-center ${getSpaceColor(
                            space
                          )} ${
                            space?.isAvailable && !reservedSpots.has(spaceId)
                              ? "cursor-pointer active:scale-95"
                              : "cursor-not-allowed"
                          }`}
                        >
                          <Car className="h-4 w-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-white border-2 border-gray-300 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Selected</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Fixed Card */}
      {selectedSpot && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-30">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600">Selected Spot</p>
                <p className="text-xl font-bold text-blue-600">Space {selectedSpot}</p>
              </div>
              {startTime && endTime && isValidTimeSelection() && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold text-gray-900">{calculateTotalCost()} DZD</p>
                  <p className="text-xs text-gray-500">
                    {(() => {
                      const minutes =
                        (new Date(`${selectedDate}T${endTime}`).getTime() -
                          new Date(`${selectedDate}T${startTime}`).getTime()) /
                        (1000 * 60);
                      const hours = Math.floor(minutes / 60);
                      const mins = Math.round(minutes % 60);
                      return hours > 0 ? `${hours}h ${mins}min` : `${mins} min`;
                    })()}
                  </p>
                </div>
              )}
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold"
              disabled={!isValidTimeSelection() || isProcessing}
              onClick={handleReservation}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Pay Your Slot</>
              )}
            </Button>
            
            <p className="text-xs text-center text-gray-500 mt-2">
              100 DZD per 30 minutes
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingLotDetail;