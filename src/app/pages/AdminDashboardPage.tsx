import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { analyticsData, bookings } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import {
  Calendar,
  Home,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar as CalendarIcon,
  User,
  Users,
  FileText,
  Wrench,
  AlertCircle,
  Building,
  MapPin,
  Eye,
  XCircle,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../components/ui/sheet';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null);

  const stats = [
    {
      title: 'Total Bookings',
      value: analyticsData.totalBookings,
      icon: <Calendar className="h-5 w-5 text-primary" />,
      change: '+12% from last month'
    },
    {
      title: 'Room Utilization',
      value: `${analyticsData.roomUtilization}%`,
      icon: <TrendingUp className="h-5 w-5 text-accent" />,
      change: '+5% from last month'
    },
    {
      title: 'Pending Approvals',
      value: analyticsData.pendingApprovals,
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      change: 'Needs attention'
    },
    {
      title: 'Active Rooms',
      value: analyticsData.activeRooms,
      icon: <Home className="h-5 w-5 text-primary" />,
      change: '2 under maintenance'
    }
  ];

  const recentBookings = bookings
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of room bookings and system statistics
          </p>
        </div>
        <Button onClick={() => navigate('/admin/approvals')}>
          View Pending Approvals
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Bookings Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.weeklyBookings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#2563EB" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Utilization by Hour */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.utilizationByHour}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="utilization"
                    stroke="#22C55E"
                    strokeWidth={2}
                    dot={{ fill: '#22C55E', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Booking Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Booking Requests</CardTitle>
            <Button variant="outline" onClick={() => navigate('/admin/approvals')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{booking.roomName}</h4>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {booking.userName} • {booking.building}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.date).toLocaleDateString()} • {booking.startTime} - {booking.endTime}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(booking)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Rooms */}
      <Card>
        <CardHeader>
          <CardTitle>Most Booked Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topRooms.map((room, index) => (
              <div key={room.name} className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{room.name}</p>
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(room.bookings / analyticsData.topRooms[0].bookings) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium">{room.bookings}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Details Sheet */}
      <Sheet open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <SheetContent className="w-full md:max-w-lg overflow-y-auto">
          {selectedBooking && (
            <>
              <SheetHeader>
                <SheetTitle>Booking Details</SheetTitle>
                <SheetDescription>
                  Review the booking information
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                  <StatusBadge status={selectedBooking.status} />
                </div>
                
                {/* Room Information Card */}
                <div className="p-4 border rounded-lg space-y-3 bg-card">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Room</Label>
                      <p className="text-lg font-semibold mt-1">{selectedBooking.roomName}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{selectedBooking.building}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* User Information */}
                <div className="p-4 border rounded-lg bg-card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <User className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Requested By</Label>
                      <p className="font-semibold mt-1">{selectedBooking.userName}</p>
                    </div>
                  </div>
                </div>
                
                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex items-start gap-2">
                      <CalendarIcon className="h-4 w-4 text-primary mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <Label className="text-xs text-muted-foreground">Date</Label>
                        <p className="font-medium text-sm mt-1 leading-tight">
                          {new Date(selectedBooking.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-primary mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <Label className="text-xs text-muted-foreground">Time</Label>
                        <p className="font-medium text-sm mt-1 leading-tight">
                          {selectedBooking.startTime} - {selectedBooking.endTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Purpose & Attendees */}
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 text-primary mt-0.5" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Purpose</Label>
                        <p className="font-medium mt-1">{selectedBooking.purpose}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex items-start gap-3">
                      <Users className="h-4 w-4 text-primary mt-0.5" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Number of Attendees</Label>
                        <p className="font-medium mt-1">{selectedBooking.attendees} people</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Equipment Required */}
                {selectedBooking.equipment.length > 0 && (
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex items-start gap-3">
                      <Wrench className="h-4 w-4 text-primary mt-0.5" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Equipment Required</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedBooking.equipment.map(eq => (
                            <span key={eq} className="px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm font-medium">
                              {eq}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Additional Notes */}
                {selectedBooking.notes && (
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Additional Notes</Label>
                        <p className="text-sm mt-1 text-muted-foreground leading-relaxed">{selectedBooking.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Recurring Badge */}
                {selectedBooking.isRecurring && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <p className="text-sm font-medium text-amber-700">
                        This is a recurring booking request
                      </p>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                {selectedBooking.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      className="flex-1"
                      size="lg"
                      onClick={() => {
                        toast.success(`Booking for ${selectedBooking.roomName} has been approved.`);
                        setSelectedBooking(null);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="lg"
                      className="flex-1"
                      onClick={() => {
                        toast.success(`Booking for ${selectedBooking.roomName} has been rejected.`);
                        setSelectedBooking(null);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
