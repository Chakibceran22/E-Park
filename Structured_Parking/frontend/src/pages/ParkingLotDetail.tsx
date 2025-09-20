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
          
          {/* Parking Map */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
            <span>Select Your Parking Spot</span>
            <span className="text-sm font-normal text-gray-500">
              {parkingSpaces.filter(s => s.isAvailable && !reservedSpots.has(s.id)).length} available
            </span>
          </h3>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-4 shadow-2xl relative overflow-x-auto">
            {/* Scroll hint for mobile */}
            <div className="text-center text-white text-xs mb-2 opacity-75">
              ← Swipe to explore parking areas →
            </div>
            
            <div className="min-w-[700px] mx-auto">
              
              {/* Top Section */}
              <div className="flex items-start justify-center gap-0">
                {/* Top Parking Spots */}
                <div className="flex gap-[3px]">
                  {Array.from({ length: 15 }, (_, i) => {
                    const spaceId = `A${(i + 1).toString().padStart(2, "0")}`;
                    const space = parkingSpaces.find((s) => s.id === spaceId);
                    const isOccupied = !space?.isAvailable;
                    const isSelected = space?.id === selectedSpot;
                    const isReserved = reservedSpots.has(spaceId);
                    
                    return (
                      <button
                        key={spaceId}
                        onClick={() => handleSpotSelect(spaceId)}
                        disabled={isOccupied || isReserved}
                        className={`relative w-12 h-20 rounded transition-all duration-300 ${
                          isReserved ? "bg-blue-600 shadow-lg shadow-blue-500/50" :
                          isSelected ? "bg-blue-500 shadow-xl shadow-blue-500/60 scale-110" :
                          isOccupied ? "bg-gray-600/50" :
                          "bg-white/95 hover:bg-blue-100 hover:scale-105"
                        } ${
                          !isOccupied && !isReserved ? "cursor-pointer active:scale-95" : "cursor-not-allowed opacity-60"
                        }`}
                      >
                        <div className="absolute inset-[3px] border-2 border-gray-400/30 rounded-sm"></div>
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-600">
                          {spaceId}
                        </div>
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Car className="h-6 w-6 text-white drop-shadow-lg" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* Top Right Barrier */}
                <div className="w-8 h-20 ml-1 rounded relative overflow-hidden shadow-lg" style={{
                  background: 'repeating-linear-gradient(135deg, #ef4444 0px, #ef4444 6px, white 6px, white 12px)'
                }}>
                </div>
              </div>

              {/* Top Horizontal Road */}
              <div className="h-14 bg-gray-600 relative my-1 rounded shadow-inner">
                <div className="absolute inset-0 flex items-center justify-around px-8">
                  <span className="text-white/80 text-2xl">→</span>
                  <span className="text-white/80 text-2xl">→</span>
                  <span className="text-white/80 text-2xl">→</span>
                </div>
              </div>

              {/* Middle Section */}
              <div className="flex gap-0 justify-center">
                {/* Left Barrier */}
                <div className="w-8 h-64 rounded relative overflow-hidden mr-1 shadow-lg" style={{
                  background: 'repeating-linear-gradient(135deg, #ef4444 0px, #ef4444 6px, white 6px, white 12px)'
                }}>
                </div>

                {/* Left Vertical Parking */}
                <div className="flex flex-col gap-[3px]">
                  {Array.from({ length: 12 }, (_, i) => {
                    const spaceId = `B${(i + 1).toString().padStart(2, "0")}`;
                    const space = parkingSpaces.find((s) => s.id === spaceId);
                    const isOccupied = !space?.isAvailable;
                    const isSelected = space?.id === selectedSpot;
                    const isReserved = reservedSpots.has(spaceId);
                    
                    return (
                      <button
                        key={spaceId}
                        onClick={() => handleSpotSelect(spaceId)}
                        disabled={isOccupied || isReserved}
                        className={`relative w-20 h-5 rounded transition-all duration-300 ${
                          isReserved ? "bg-blue-600 shadow-lg shadow-blue-500/50" :
                          isSelected ? "bg-blue-500 shadow-xl shadow-blue-500/60 scale-110" :
                          isOccupied ? "bg-gray-600/50" :
                          "bg-white/95 hover:bg-blue-100 hover:scale-105"
                        } ${
                          !isOccupied && !isReserved ? "cursor-pointer active:scale-95" : "cursor-not-allowed opacity-60"
                        }`}
                      >
                        <div className="absolute inset-[2px] border border-gray-400/30 rounded-sm"></div>
                        <span className="text-[8px] font-bold text-gray-600 absolute left-1 top-1/2 -translate-y-1/2">
                          {spaceId}
                        </span>
                        {isSelected && (
                          <Car className="h-3 w-3 text-white absolute right-1 top-1/2 -translate-y-1/2 drop-shadow" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Central Vertical Road */}
                <div className="w-28 bg-gray-600 mx-1 rounded shadow-inner relative">
                  {/* Zebra Crossing Top */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-8 flex gap-[2px]">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex-1 bg-white/90 rounded-sm"></div>
                    ))}
                  </div>
                  
                  {/* Dashed center line */}
                  <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 flex flex-col gap-2 py-3">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="flex-1 bg-yellow-300/70 rounded-full"></div>
                    ))}
                  </div>
                  
                  {/* Directional Arrows */}
                  <div className="absolute top-[25%] left-[20%] text-white/80 text-xl drop-shadow">↑</div>
                  <div className="absolute bottom-[25%] right-[20%] text-white/80 text-xl drop-shadow">↓</div>
                  
                  {/* Zebra Crossing Bottom */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-8 flex gap-[2px]">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex-1 bg-white/90 rounded-sm"></div>
                    ))}
                  </div>
                </div>

                {/* Right Vertical Parking */}
                <div className="flex flex-col gap-[3px]">
                  {Array.from({ length: 12 }, (_, i) => {
                    const spaceId = `C${(i + 1).toString().padStart(2, "0")}`;
                    const space = parkingSpaces.find((s) => s.id === spaceId);
                    const isOccupied = !space?.isAvailable;
                    const isSelected = space?.id === selectedSpot;
                    const isReserved = reservedSpots.has(spaceId);
                    
                    return (
                      <button
                        key={spaceId}
                        onClick={() => handleSpotSelect(spaceId)}
                        disabled={isOccupied || isReserved}
                        className={`relative w-20 h-5 rounded transition-all duration-300 ${
                          isReserved ? "bg-blue-600 shadow-lg shadow-blue-500/50" :
                          isSelected ? "bg-blue-500 shadow-xl shadow-blue-500/60 scale-110" :
                          isOccupied ? "bg-gray-600/50" :
                          "bg-white/95 hover:bg-blue-100 hover:scale-105"
                        } ${
                          !isOccupied && !isReserved ? "cursor-pointer active:scale-95" : "cursor-not-allowed opacity-60"
                        }`}
                      >
                        <div className="absolute inset-[2px] border border-gray-400/30 rounded-sm"></div>
                        <span className="text-[8px] font-bold text-gray-600 absolute left-1 top-1/2 -translate-y-1/2">
                          {spaceId}
                        </span>
                        {isSelected && (
                          <Car className="h-3 w-3 text-white absolute right-1 top-1/2 -translate-y-1/2 drop-shadow" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right Barrier */}
                <div className="w-8 h-64 ml-1 rounded relative overflow-hidden shadow-lg" style={{
                  background: 'repeating-linear-gradient(135deg, #ef4444 0px, #ef4444 6px, white 6px, white 12px)'
                }}>
                </div>
              </div>

              {/* Bottom Horizontal Road */}
              <div className="h-14 bg-gray-600 relative my-1 rounded shadow-inner">
                <div className="absolute inset-0 flex items-center justify-around px-8">
                  <span className="text-white/80 text-2xl">←</span>
                  <span className="text-white/80 text-2xl">←</span>
                  <span className="text-white/80 text-2xl">←</span>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="flex items-start justify-center gap-0">
                {/* Bottom Parking Spots */}
                <div className="flex gap-[3px]">
                  {Array.from({ length: 15 }, (_, i) => {
                    const spaceId = `D${(i + 1).toString().padStart(2, "0")}`;
                    const space = parkingSpaces.find((s) => s.id === spaceId);
                    const isOccupied = !space?.isAvailable;
                    const isSelected = space?.id === selectedSpot;
                    const isReserved = reservedSpots.has(spaceId);
                    
                    return (
                      <button
                        key={spaceId}
                        onClick={() => handleSpotSelect(spaceId)}
                        disabled={isOccupied || isReserved}
                        className={`relative w-12 h-20 rounded transition-all duration-300 ${
                          isReserved ? "bg-blue-600 shadow-lg shadow-blue-500/50" :
                          isSelected ? "bg-blue-500 shadow-xl shadow-blue-500/60 scale-110" :
                          isOccupied ? "bg-gray-600/50" :
                          "bg-white/95 hover:bg-blue-100 hover:scale-105"
                        } ${
                          !isOccupied && !isReserved ? "cursor-pointer active:scale-95" : "cursor-not-allowed opacity-60"
                        }`}
                      >
                        <div className="absolute inset-[3px] border-2 border-gray-400/30 rounded-sm"></div>
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-600">
                          {spaceId}
                        </div>
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Car className="h-6 w-6 text-white drop-shadow-lg" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* Bottom Right Barrier */}
                <div className="w-8 h-20 ml-1 rounded relative overflow-hidden shadow-lg" style={{
                  background: 'repeating-linear-gradient(135deg, #ef4444 0px, #ef4444 6px, white 6px, white 12px)'
                }}>
                </div>
              </div>

            </div>

            {/* Legend */}
            <div className="mt-5 pt-4 border-t border-gray-600/50 flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/95 rounded shadow-sm border-2 border-gray-400/30"></div>
                <span className="text-white text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-600/50 rounded shadow-sm"></div>
                <span className="text-white text-sm">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded shadow-lg shadow-blue-500/50"></div>
                <span className="text-white text-sm">Your Selection</span>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                <span className="text-sm font-medium text-gray-700">Live availability</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {parkingSpaces.filter(s => s.isAvailable && !reservedSpots.has(s.id)).length}
                </p>
                <p className="text-xs text-gray-500">spots available</p>
              </div>
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