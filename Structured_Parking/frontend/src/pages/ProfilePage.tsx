import { Link, useLocation } from 'react-router-dom'
import { Map, Calendar, User } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const ProfilePage = () => {
  const location = useLocation()

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

      <main className="flex-1 overflow-y-auto pb-20 px-4 pt-8">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
        </div>
        
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-base">Chakib</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-base">cryptechs@gmail.com</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-base">+213 555 123 456</p>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
              Logout
            </Button>
          </CardContent>
        </Card>
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

export default ProfilePage