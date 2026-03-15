import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { currentUser, rooms, generateTimeSlots } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { StatusBadge } from '../components/StatusBadge';
import { MapPin, Users, Star, ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Calendar } from '../components/ui/calendar';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { createBooking } from '../api/bookings';

export function RoomDetailPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const room = rooms.find(r => r.id === roomId);
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Booking form state
  const [selectedTime, setSelectedTime] = useState({ start: '', end: '' });
  const [purpose, setPurpose] = useState('');
  const [attendees, setAttendees] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Room not found</h2>
          <Button onClick={() => navigate('/rooms')}>Back to Rooms</Button>
        </div>
      </div>
    );
  }

  // Mock availability data
  const timeSlots = generateTimeSlots();
  const availabilityStatus = timeSlots.reduce((acc, time) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 9 || hour > 17) {
      acc[time] = 'unavailable';
    } else if (hour === 14 || hour === 15) {
      acc[time] = 'booked';
    } else {
      acc[time] = 'available';
    }
    return acc;
  }, {} as Record<string, 'available' | 'booked' | 'unavailable'>);

  const handleEquipmentToggle = (equipment: string) => {
    setSelectedEquipment(prev =>
      prev.includes(equipment)
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    );
  };

  const handleBookingSubmit = async () => {
    if (bookingStep === 1) {
      // Validate step 1
      if (!selectedTime.start || !selectedTime.end) {
        toast.error('Please select both start and end time');
        return;
      }
      setBookingStep(2);
    } else {
      // Validate step 2 and submit
      if (!purpose || !attendees) {
        toast.error('Please fill in all required fields');
        return;
      }
      try {
        const requiresApproval = room.type === 'lecture-hall' || room.capacity > 50;
        const status = requiresApproval ? 'pending' : 'confirmed';
        const yyyyMmDd = selectedDate.toISOString().slice(0, 10);

        await createBooking({
          roomId: room.id,
          userId: currentUser.id,
          userName: currentUser.name,
          roomName: room.name,
          building: room.building,
          date: yyyyMmDd,
          startTime: selectedTime.start,
          endTime: selectedTime.end,
          purpose,
          attendees: Number(attendees),
          status,
          equipment: selectedEquipment,
          notes,
          isRecurring,
        });

        toast.success(
          status === 'pending'
            ? 'Booking request submitted successfully! Awaiting approval.'
            : 'Booking confirmed successfully!'
        );

        setShowBookingModal(false);
        // Reset form
        setBookingStep(1);
        setSelectedTime({ start: '', end: '' });
        setPurpose('');
        setAttendees('');
        setSelectedEquipment([]);
        setNotes('');
        setIsRecurring(false);

        navigate('/dashboard');
      } catch (_e) {
        toast.error('Failed to submit booking. Please try again.');
      }
    }
  };

  const getSlotColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-accent hover:bg-accent/80 text-white';
      case 'booked':
        return 'bg-destructive text-white cursor-not-allowed';
      case 'unavailable':
        return 'bg-muted text-muted-foreground cursor-not-allowed';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/rooms')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Rooms
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Room Images and Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room Image */}
          <div className="relative h-96 rounded-xl overflow-hidden">
            <ImageWithFallback
              src={room.image}
              alt={room.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Star
                className={`h-6 w-6 ${isFavorite ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground'}`}
              />
            </button>
          </div>

          {/* Room Information */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{room.name}</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{room.building} - Floor {room.floor}</span>
                  </div>
                </div>
                {room.isMaintenance ? (
                  <StatusBadge status="maintenance" />
                ) : (
                  <StatusBadge status={room.isAvailable ? 'available' : 'booked'} />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">Capacity: {room.capacity} people</span>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Available Facilities</h3>
                <div className="flex flex-wrap gap-2">
                  {room.facilities.map((facility) => (
                    <span
                      key={facility}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm font-medium"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Room Type</h3>
                <p className="text-muted-foreground capitalize">
                  {room.type.replace('-', ' ')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Availability Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Check Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">
                    Available Time Slots - {selectedDate.toLocaleDateString()}
                  </h4>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-accent"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-destructive"></div>
                      <span>Booked</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {timeSlots.map((time) => {
                    const status = availabilityStatus[time];
                    const isDisabled = status !== 'available';
                    return (
                      <button
                        key={time}
                        disabled={isDisabled}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${getSlotColor(
                          status
                        )}`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Book This Room</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Selected Date</Label>
                <div className="p-3 bg-muted rounded-lg font-medium">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Room Details</Label>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• Capacity: {room.capacity} people</p>
                  <p>• Type: {room.type.replace('-', ' ')}</p>
                  <p>• Floor: {room.floor}</p>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => setShowBookingModal(true)}
                disabled={room.isMaintenance}
              >
                {room.isMaintenance ? 'Under Maintenance' : 'Book Now'}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                {room.type === 'lecture-hall' || room.capacity > 50
                  ? 'Bookings require approval from admin'
                  : 'Instant booking available'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Book {room.name} - Step {bookingStep} of 2
            </DialogTitle>
            <DialogDescription>
              {bookingStep === 1
                ? 'Select your preferred time slot'
                : 'Provide booking details and requirements'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {bookingStep === 1 ? (
              <>
                {/* Step 1: Time Selection */}
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Selected Date</p>
                    <p className="text-lg">
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time *</Label>
                      <select
                        id="startTime"
                        value={selectedTime.start}
                        onChange={(e) =>
                          setSelectedTime({ ...selectedTime, start: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-md border border-input bg-background"
                      >
                        <option value="">Select start time</option>
                        {timeSlots
                          .filter((time) => availabilityStatus[time] === 'available')
                          .map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time *</Label>
                      <select
                        id="endTime"
                        value={selectedTime.end}
                        onChange={(e) =>
                          setSelectedTime({ ...selectedTime, end: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        disabled={!selectedTime.start}
                      >
                        <option value="">Select end time</option>
                        {timeSlots
                          .filter((time) => {
                            if (!selectedTime.start) return false;
                            return (
                              time > selectedTime.start &&
                              availabilityStatus[time] === 'available'
                            );
                          })
                          .map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {selectedTime.start && selectedTime.end && (
                    <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                      <p className="text-sm font-medium text-accent">
                        Duration: {calculateDuration(selectedTime.start, selectedTime.end)}
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Step 2: Booking Details */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose *</Label>
                    <Input
                      id="purpose"
                      placeholder="e.g., Team Meeting, Study Session"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="attendees">Number of Attendees *</Label>
                    <Input
                      id="attendees"
                      type="number"
                      placeholder="How many people will attend?"
                      value={attendees}
                      onChange={(e) => setAttendees(e.target.value)}
                      max={room.capacity}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum capacity: {room.capacity}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Required Equipment</Label>
                    <div className="space-y-2">
                      {room.facilities.map((facility) => (
                        <div key={facility} className="flex items-center space-x-2">
                          <Checkbox
                            id={facility}
                            checked={selectedEquipment.includes(facility)}
                            onCheckedChange={() => handleEquipmentToggle(facility)}
                          />
                          <label
                            htmlFor={facility}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {facility}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special requirements or notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recurring"
                      checked={isRecurring}
                      onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
                    />
                    <label
                      htmlFor="recurring"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Make this a recurring booking
                    </label>
                  </div>

                  {room.type === 'lecture-hall' || room.capacity > 50 ? (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <p className="text-sm text-amber-700">
                        ⚠️ This booking requires admin approval
                      </p>
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between gap-3">
            {bookingStep === 2 && (
              <Button variant="outline" onClick={() => setBookingStep(1)}>
                Back
              </Button>
            )}
            <Button
              className="flex-1"
              onClick={handleBookingSubmit}
            >
              {bookingStep === 1 ? 'Next' : 'Submit Booking'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function calculateDuration(start: string, end: string): string {
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);
  const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  if (hours > 0 && minutes > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    return `${minutes} minutes`;
  }
}
