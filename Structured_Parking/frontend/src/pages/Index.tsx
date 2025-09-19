"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Star, ArrowRight, Shield, Smartphone, CreditCard, Users } from "lucide-react"
import { Link } from "react-router-dom"

const Index = () => {
  const features = [
    {
      icon: <Smartphone className="h-8 w-8 text-primary" />,
      title: "Real-time Availability",
      description: "See live parking spot availability across all locations with instant updates.",
    },
    {
      icon: <CreditCard className="h-8 w-8 text-primary" />,
      title: "Easy Booking",
      description: "Reserve your spot in seconds with our streamlined booking process and secure payments.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure Payments",
      description: "Your payment information is protected with bank-level security and encryption.",
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "24/7 Support",
      description: "Get help whenever you need it with our round-the-clock customer support team.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Professional",
      content: "E-Park has completely transformed my daily commute. No more circling blocks looking for parking!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Event Organizer",
      content: "The automation features save me hours of work. My clients love the seamless parking experience.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Frequent Traveler",
      content: "Being able to reserve airport parking in advance gives me such peace of mind when traveling.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">E-Park</h1>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Find Parking
                </Button>
              </Link>
              <Link to="/login">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
              <span className="text-primary">Smart Parking</span>
              <br />
              <span className="text-accent">Made Simple</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
              Our automated parking reservation system helps you find, reserve, and pay for parking spots effortlessly.
              Say goodbye to parking stress and hello to convenience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Find Parking Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Why Choose E-Park?</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our automation technology makes parking reservations faster, easier, and more reliable than ever before.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center border-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl text-card-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Available Spots</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Customer Support</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Parking Locations</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">4.5★</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        

        {/* CTA Section */}
        <section className="py-20 px-4 text-center">
          <div className="container mx-auto max-w-3xl">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              Ready to Transform Your Parking Experience?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of users who have already discovered the convenience of automated parking reservations.
            </p>
            <Link to="/login">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Get Started Today
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">E-Park</h4>
              <p className="text-sm opacity-80">
                Automated parking reservations made simple. Find, reserve, and pay for parking with ease.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Product</h5>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link to="/login" className="hover:opacity-100">
                    Find Parking
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:opacity-100">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100">
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Support</h5>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <a href="#" className="hover:opacity-100">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Company</h5>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <a href="#" className="hover:opacity-100">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-80">
            <p>&copy; 2024 E-Park. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index
