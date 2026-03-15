import React, { useEffect, useMemo, useState } from 'react';
import { BookingCard } from '../components/BookingCard';
import { currentUser } from '../data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Search, Calendar, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';
import { deleteBooking, fetchBookings, updateBooking } from '../api/bookings';
import type { Booking } from '../data/mockData';

export function MyBookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [bookings, setBookings] = useState<Booking[]>([]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchBookings(currentUser.id)
      .then((rows) => {
        if (!cancelled) setBookings(rows);
      })
      .catch(() => {
        if (!cancelled) setBookings([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const userBookings = useMemo(
    () => bookings.filter(b => b.userId === currentUser.id),
    [bookings]
  );

  const upcomingBookings = userBookings
    .filter(b => {
      const bookingDate = new Date(b.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate >= today && b.status !== 'cancelled';
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastBookings = userBookings
    .filter(b => {
      const bookingDate = new Date(b.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate < today || b.status === 'cancelled';
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filterBookings = (bookingsList: Booking[]) => {
    return bookingsList.filter(booking => {
      // Search filter
      if (searchQuery && !booking.roomName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !booking.building.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && booking.status !== statusFilter) {
        return false;
      }

      return true;
    });
  };

  const handleCancel = async (booking: Booking) => {
    try {
      await deleteBooking(booking.id);
      setBookings(prev => prev.filter(b => b.id !== booking.id));
      toast.success(`Booking for ${booking.roomName} has been cancelled.`);
    } catch {
      toast.error('Failed to cancel booking. Please try again.');
    }
  };

  const handleEdit = async (booking: Booking) => {
    const newPurpose = window.prompt('Update purpose', booking.purpose);
    if (newPurpose === null) return;

    const newAttendeesRaw = window.prompt(
      'Update number of attendees',
      String(booking.attendees),
    );
    if (newAttendeesRaw === null) return;

    const newAttendees = Number(newAttendeesRaw);
    if (!Number.isFinite(newAttendees) || newAttendees <= 0) {
      toast.error('Attendees must be a positive number.');
      return;
    }

    try {
      const updated = await updateBooking(booking.id, {
        purpose: newPurpose,
        attendees: newAttendees,
      });
      setBookings(prev =>
        prev.map(b => (b.id === updated.id ? updated : b)),
      );
      toast.success('Booking updated.');
    } catch {
      toast.error('Failed to update booking. Please try again.');
    }
  };

  const handleView = (booking: Booking) => {
    toast.info('View booking details coming soon!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-muted-foreground">
          View and manage all your room bookings
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {filterBookings(upcomingBookings).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No upcoming bookings</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No bookings match your search criteria.'
                    : "You don't have any upcoming room bookings."}
                </p>
                {!(searchQuery || statusFilter !== 'all') && (
                  <Button onClick={() => window.location.href = '/rooms'}>
                    Book a Room
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filterBookings(upcomingBookings).map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onView={handleView}
                  onEdit={handleEdit}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {filterBookings(pastBookings).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No past bookings</h3>
                <p className="text-muted-foreground text-center">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No bookings match your search criteria.'
                    : "You don't have any past bookings yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filterBookings(pastBookings).map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onView={handleView}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
