import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bell, Download, Search, Filter, Car, Clock, Users, TrendingUp } from "lucide-react"

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // Stats data
  const stats = [
    { label: 'Parking Lots Occupied', value: '13 / 50', icon: Car, color: 'text-blue-600' },
    { label: 'Average parking hours', value: '6h', icon: Clock, color: 'text-blue-600' },
    { label: "Today's Collection", value: '2600 da', icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Loyalty Card Customers', value: '3', icon: Users, color: 'text-blue-600' }
  ]

  // Parking occupancy rows
  const parkingRows = [
    { 
      id: 1, 
      name: 'Row 1',
      spots: [
        { occupied: true, customer: 'MH 27 CA 2305' },
        { occupied: false },
        { occupied: true, customer: 'MH 41 WD 3689' },
        { occupied: false },
        { occupied: false },
        { occupied: true, customer: 'MH 02 DA 4675' },
        { occupied: false },
        { occupied: false },
        { occupied: false },
        { occupied: false }
      ]
    },
    { 
      id: 2, 
      name: 'Row 2',
      spots: [
        { occupied: false },
        { occupied: false },
        { occupied: true, customer: 'MH 41 WD 3689' },
        { occupied: false },
        { occupied: false },
        { occupied: false },
        { occupied: true, customer: 'MH 02 DA 4675' },
        { occupied: false },
        { occupied: false },
        { occupied: false }
      ]
    },
    { 
      id: 3, 
      name: 'Row 3',
      spots: [
        { occupied: true, customer: 'MH 27 CA 2305' },
        { occupied: false },
        { occupied: true, customer: 'MH 41 WD 3689' },
        { occupied: false },
        { occupied: false },
        { occupied: false },
        { occupied: true, customer: 'MH 02 DA 4675' },
        { occupied: false },
        { occupied: false },
        { occupied: false }
      ]
    },
    { 
      id: 4, 
      name: 'Row 4',
      spots: [
        { occupied: false },
        { occupied: false },
        { occupied: false },
        { occupied: false },
        { occupied: false },
        { occupied: false },
        { occupied: true, customer: 'MH 02 DA 4675' },
        { occupied: false },
        { occupied: false },
        { occupied: true, customer: 'MH 27 CA 2305' }
      ]
    },
    { 
      id: 5, 
      name: 'Row 5',
      spots: [
        { occupied: true, customer: 'MH 27 CA 2305' },
        { occupied: false },
        { occupied: false },
        { occupied: false },
        { occupied: false },
        { occupied: false },
        { occupied: false },
        { occupied: false },
        { occupied: false },
        { occupied: false }
      ]
    }
  ]

  // Loyalty card customers
  const loyaltyCustomers = [
    { id: 'MH 27 CA 2305', name: 'Manon Kumar Jain', status: 'Active' },
    { id: 'MH 41 WD 3689', name: 'Rahul Sharma', status: 'Active' },
    { id: 'MH 02 DA 4675', name: 'Yashwant Kumar', status: 'Active' },
    { id: 'MH 02 DA 6175', name: 'Parveen Rathore', status: 'Active' }
  ]

  // Alerts
  const alerts = [
    { id: 'MH 27 CA 2305', issue: 'parking in a second position', level: 'Urgent' },
    { id: 'MH 41 WD 3689', issue: 'stayed overtime', level: 'Neutral' },
    { id: 'MH 02 DA 4675', issue: 'Another problem', level: 'Solved' }
  ]

  // Current parking allotments
  const parkingAllotments = [
    { carNumber: 'MH 27 CA 2305', inTime: '05/12/2023 - 04:42PM', status: 'Active', charge: '1199 da', action: 'View Details' },
    { carNumber: 'MH 41 WD 3689', inTime: '05/12/2023 - 02:22AM', status: 'Active', charge: '50 da', action: 'View Details' },
    { carNumber: 'MH 02 DA 4675', inTime: '05/12/2023 - 04:36PM', status: 'Active', charge: '50 da', action: 'View Details' },
    { carNumber: 'MH 15 WD 1457', inTime: '05/12/2023 - 12:36PM', status: 'Active', charge: '50 da', action: 'View Details' },
    { carNumber: 'MH 27 CA 5947', inTime: '05/12/2023 - 05:54PM', status: 'Left at 04:00 PM', charge: '250da', action: 'View Details' },
    { carNumber: 'RJ 27 EA FFEFF', inTime: '05/12/2023 - 03:28PM', status: 'Left at 06:00PM', charge: '1350 da', action: 'View Details' },
    { carNumber: 'MH 27 CA 2305', inTime: '05/12/2023 - 08:58AM', status: 'Left at 10:00AM', charge: '50 da', action: 'View Details' },
    { carNumber: 'MH 41 MS 2036', inTime: '05/12/2023 - 04:12AM', status: 'Active', charge: '50 da', action: 'View Details' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Live Overview</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="border-gray-300">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 bg-blue-50 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Parking Occupancy */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Parking Occupancy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parkingRows.map((row) => (
                    <div key={row.id}>
                      <p className="text-sm font-medium text-blue-600 mb-2">{row.name}</p>
                      <div className="flex gap-2">
                        {row.spots.map((spot, idx) => (
                          <div
                            key={idx}
                            className={`w-10 h-10 rounded flex items-center justify-center ${
                              spot.occupied ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
                            }`}
                            title={spot.customer || 'Empty'}
                          >
                            <Car className="h-5 w-5" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Parking Lot Allotment */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Current Parking Lot Allotment</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 text-sm font-medium text-gray-600">Car Number Plate</th>
                        <th className="pb-3 text-sm font-medium text-gray-600">In Time</th>
                        <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                        <th className="pb-3 text-sm font-medium text-gray-600">Charge</th>
                        <th className="pb-3 text-sm font-medium text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parkingAllotments.map((item, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="py-3 text-sm">{item.carNumber}</td>
                          <td className="py-3 text-sm text-gray-600">{item.inTime}</td>
                          <td className="py-3">
                            <Badge className={item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                              {item.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-sm font-medium">{item.charge}</td>
                          <td className="py-3">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600">50 Items per page</p>
                  <p className="text-sm text-gray-600">1 of 1 pages</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Loyalty & Alerts */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Card Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loyaltyCustomers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{customer.id}</p>
                        <p className="text-xs text-gray-600">{customer.name}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">{customer.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alerts and problems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.id}</p>
                        <p className="text-xs text-gray-600">{alert.issue}</p>
                      </div>
                      <Badge className={
                        alert.level === 'Urgent' ? 'bg-red-100 text-red-700' :
                        alert.level === 'Neutral' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }>
                        {alert.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard