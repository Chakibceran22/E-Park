"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import {
  CheckCircle,
  MapPin,
  Clock,
  Car,
  Receipt,
  ArrowRight,
  Home,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentVerify = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const order = params.get("order_number");
    const getPaymentDetails = async (order) => {
      try {
        setLoading(true);
        if (order) {
          setOrderNumber(order);
          const response = await axios.post(
            `http://localhost:3000/show-transaction`,
            {
              orderNumber: order,
            }
          );
          const reservationOptions = JSON.parse(
            localStorage.getItem("reserveInformations")
          );
          setPaymentDetails({
            amount: response.data.data.attributes.amount,
            startTime: reservationOptions.startTime,
            endTime: reservationOptions.endTime,
            parkingSpot: reservationOptions.parkingSpot,
            date: reservationOptions.date,
            location: reservationOptions.location,
          });
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
      } finally {
        setLoading(false);
      }
    };

    getPaymentDetails(order);
  }, []);

  const handleDownloadReceipt = async (orderNumber) => {
    if (!orderNumber) return;
    try {
      const response = await axios.post(
        "http://localhost:3000/download-receipt",
        {
          orderNumber: orderNumber,
        }
      );
      window.open(response.data.href, "_blank");
    } catch (error) {
      console.error("Error downloading receipt:", error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (!orderNumber || !paymentDetails) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2">Invalid Payment Link</h2>
            <p className="text-gray-600 mb-6">
              No order number found in the URL
            </p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <h1 className="text-xl font-bold text-blue-600">E-Park</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Success Animation */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600">Your parking spot has been reserved</p>
          </div>

          {/* Payment Details Card */}
          <Card className="mb-4 shadow-md border-blue-100">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {paymentDetails.amount} DZD
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="text-sm font-mono font-semibold text-gray-900">
                    {orderNumber}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-base mb-3 text-gray-900">
                  Reservation Details
                </h3>

                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Car className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Parking Spot</p>
                    <p className="font-semibold text-gray-900">
                      {paymentDetails.parkingSpot}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">{paymentDetails.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Time</p>
                    <p className="font-semibold text-gray-900">
                      {paymentDetails.startTime} - {paymentDetails.endTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Receipt className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Date</p>
                    <p className="font-semibold text-gray-900">{paymentDetails.date}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3 mb-4">
            <Button
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={() => navigate("/reservations")}
            >
              View My Reservations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => handleDownloadReceipt(orderNumber)}
            >
              <Receipt className="mr-2 h-5 w-5" />
              Download Receipt
            </Button>

            <Button
              variant="ghost"
              className="w-full text-gray-600 hover:bg-gray-100"
              onClick={() => (window.location.href = "/")}
            >
              <Home className="mr-2 h-5 w-5" />
              Return to Home
            </Button>
          </div>

          {/* Additional Info */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-gray-700 text-center">
              <strong>Note:</strong> Please arrive at least 5 minutes before your reservation time.
              Show this confirmation at the parking entrance.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentVerify;