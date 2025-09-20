import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import ParkingLots from "./pages/ParkingLots";
import ParkingLotDetail from "./pages/ParkingLotDetail";
import PaymentVerify from "./pages/PaymentVerifications";
import MapPage from "./pages/MapPage";
import ReservationsPage from "./pages/ReservationPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/AdminPage";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Index />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/main" element={<ParkingLots />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/parking-lot/:id" element={<ParkingLotDetail />} />
          <Route path="/paymentverification/" element={<PaymentVerify />} />
          <Route path="/" element={<MapPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
