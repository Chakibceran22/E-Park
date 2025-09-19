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

  const handleDownloadReceipt = async (orderNumber: string) => {
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
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (!orderNumber || !paymentDetails) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-brand">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2">Invalid Payment Link</h2>
            <p className="text-muted-foreground mb-6">
              No order number found in the URL
            </p>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="auth"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            E-Park
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Payment Successful!
            </h2>
            <p className="text-muted-foreground">Your parking spot has been reserved</p>
          </div>

          {/* Payment Details Card */}
          <Card className="mb-6 shadow-brand">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                  <p className="text-3xl font-bold text-primary">
                    {paymentDetails.amount} DZD
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="text-lg font-mono font-semibold">
                    {orderNumber}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4 text-foreground">
                  Reservation Details
                </h3>

                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Car className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Parking Spot</p>
                      <p className="font-semibold">
                        {paymentDetails.parkingSpot}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold">{paymentDetails.location}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-semibold">
                        {paymentDetails.startTime} - {paymentDetails.endTime}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {paymentDetails.duration}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Receipt className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-semibold">{paymentDetails.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full py-6"
              variant="auth"
              onClick={() => navigate("/profile")}
            >
              View My Reservations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              className="w-full py-6"
              onClick={() => handleDownloadReceipt(orderNumber)}
            >
              <Receipt className="mr-2 h-5 w-5" />
              Download Receipt
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => (window.location.href = "/")}
            >
              Return to Home
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-secondary/50 rounded-lg text-center border border-accent">
            <p className="text-sm text-muted-foreground">
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