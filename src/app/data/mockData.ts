// Mock data for RoomifyU application

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer' | 'admin';
  department: string;
  avatar?: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  type: 'classroom' | 'lecture-hall' | 'lab' | 'meeting-room' | 'seminar-room';
  facilities: string[];
  image: string;
  isAvailable: boolean;
  isMaintenance: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  roomName: string;
  building: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  attendees: number;
  status: 'confirmed' | 'pending' | 'rejected' | 'cancelled';
  equipment: string[];
  notes?: string;
  isRecurring: boolean;
}

export interface Notification {
  id: string;
  type: 'booking' | 'approval' | 'cancellation' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Current user
export const currentUser: User = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@university.edu',
  role: 'student',
  department: 'Computer Science'
};

// Sample rooms
export const rooms: Room[] = [
  {
    id: 'r1',
    name: 'Room 301',
    building: 'Engineering Block A',
    floor: 3,
    capacity: 30,
    type: 'classroom',
    facilities: ['Projector', 'Whiteboard', 'AC', 'WiFi'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    isAvailable: true,
    isMaintenance: false
  },
  {
    id: 'r2',
    name: 'Lecture Hall 1',
    building: 'Main Building',
    floor: 2,
    capacity: 150,
    type: 'lecture-hall',
    facilities: ['Projector', 'Microphone', 'AC', 'WiFi', 'Recording Equipment'],
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    isAvailable: true,
    isMaintenance: false
  },
  {
    id: 'r3',
    name: 'Computer Lab 2',
    building: 'Engineering Block B',
    floor: 1,
    capacity: 40,
    type: 'lab',
    facilities: ['Computers', 'Projector', 'AC', 'WiFi', 'Software Lab'],
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
    isAvailable: false,
    isMaintenance: false
  },
  {
    id: 'r4',
    name: 'Meeting Room A',
    building: 'Administration Block',
    floor: 1,
    capacity: 12,
    type: 'meeting-room',
    facilities: ['TV Display', 'Whiteboard', 'AC', 'WiFi', 'Conference Phone'],
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
    isAvailable: true,
    isMaintenance: false
  },
  {
    id: 'r5',
    name: 'Seminar Room 5',
    building: 'Library Building',
    floor: 3,
    capacity: 50,
    type: 'seminar-room',
    facilities: ['Projector', 'Whiteboard', 'AC', 'WiFi', 'Sound System'],
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
    isAvailable: true,
    isMaintenance: false
  },
  {
    id: 'r6',
    name: 'Room 205',
    building: 'Science Block',
    floor: 2,
    capacity: 35,
    type: 'classroom',
    facilities: ['Projector', 'Whiteboard', 'AC', 'WiFi'],
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    isAvailable: true,
    isMaintenance: false
  },
  {
    id: 'r7',
    name: 'Physics Lab',
    building: 'Science Block',
    floor: 1,
    capacity: 25,
    type: 'lab',
    facilities: ['Lab Equipment', 'Whiteboard', 'AC', 'WiFi', 'Safety Equipment'],
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
    isAvailable: false,
    isMaintenance: true
  },
  {
    id: 'r8',
    name: 'Lecture Hall 3',
    building: 'Main Building',
    floor: 1,
    capacity: 200,
    type: 'lecture-hall',
    facilities: ['Projector', 'Microphone', 'AC', 'WiFi', 'Recording Equipment', 'Stage'],
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
    isAvailable: true,
    isMaintenance: false
  }
];

// Sample bookings
export const bookings: Booking[] = [
  {
    id: 'b1',
    roomId: 'r1',
    userId: '1',
    userName: 'Sarah Johnson',
    roomName: 'Room 301',
    building: 'Engineering Block A',
    date: '2026-02-28',
    startTime: '10:00',
    endTime: '12:00',
    purpose: 'Study Group Session',
    attendees: 15,
    status: 'confirmed',
    equipment: ['Projector'],
    notes: 'Working on group project',
    isRecurring: false
  },
  {
    id: 'b2',
    roomId: 'r2',
    userId: '1',
    userName: 'Sarah Johnson',
    roomName: 'Lecture Hall 1',
    building: 'Main Building',
    date: '2026-03-02',
    startTime: '14:00',
    endTime: '16:00',
    purpose: 'Workshop Presentation',
    attendees: 80,
    status: 'pending',
    equipment: ['Projector', 'Microphone'],
    notes: 'ML Workshop for students',
    isRecurring: false
  },
  {
    id: 'b3',
    roomId: 'r4',
    userId: '1',
    userName: 'Sarah Johnson',
    roomName: 'Meeting Room A',
    building: 'Administration Block',
    date: '2026-03-05',
    startTime: '09:00',
    endTime: '10:30',
    purpose: 'Team Meeting',
    attendees: 8,
    status: 'confirmed',
    equipment: ['TV Display'],
    isRecurring: true
  },
  {
    id: 'b4',
    roomId: 'r5',
    userId: '2',
    userName: 'Prof. Michael Chen',
    roomName: 'Seminar Room 5',
    building: 'Library Building',
    date: '2026-02-27',
    startTime: '13:00',
    endTime: '15:00',
    purpose: 'Guest Lecture',
    attendees: 40,
    status: 'confirmed',
    equipment: ['Projector', 'Sound System'],
    isRecurring: false
  },
  {
    id: 'b5',
    roomId: 'r1',
    userId: '3',
    userName: 'Dr. Emily White',
    roomName: 'Room 301',
    building: 'Engineering Block A',
    date: '2026-02-26',
    startTime: '15:00',
    endTime: '17:00',
    purpose: 'Tutorial Session',
    attendees: 20,
    status: 'confirmed',
    equipment: ['Whiteboard'],
    isRecurring: false
  }
];

// Sample notifications
export const notifications: Notification[] = [
  {
    id: 'n1',
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your booking for Room 301 on Feb 28 has been confirmed.',
    timestamp: '2026-02-25T09:30:00',
    read: false
  },
  {
    id: 'n2',
    type: 'approval',
    title: 'Approval Pending',
    message: 'Your booking for Lecture Hall 1 is pending approval.',
    timestamp: '2026-02-25T08:15:00',
    read: false
  },
  {
    id: 'n3',
    type: 'reminder',
    title: 'Upcoming Booking',
    message: 'Reminder: You have a booking tomorrow at 10:00 AM in Room 301.',
    timestamp: '2026-02-24T18:00:00',
    read: true
  },
  {
    id: 'n4',
    type: 'booking',
    title: 'New Feature Available',
    message: 'You can now mark rooms as favorites for quick access!',
    timestamp: '2026-02-23T10:00:00',
    read: true
  }
];

// Analytics data
export const analyticsData = {
  totalBookings: 1247,
  roomUtilization: 78,
  pendingApprovals: 23,
  activeRooms: 45,
  weeklyBookings: [
    { day: 'Mon', bookings: 45 },
    { day: 'Tue', bookings: 52 },
    { day: 'Wed', bookings: 48 },
    { day: 'Thu', bookings: 61 },
    { day: 'Fri', bookings: 38 },
    { day: 'Sat', bookings: 15 },
    { day: 'Sun', bookings: 8 }
  ],
  utilizationByHour: [
    { hour: '8:00', utilization: 25 },
    { hour: '9:00', utilization: 45 },
    { hour: '10:00', utilization: 72 },
    { hour: '11:00', utilization: 85 },
    { hour: '12:00', utilization: 60 },
    { hour: '13:00', utilization: 55 },
    { hour: '14:00', utilization: 78 },
    { hour: '15:00', utilization: 82 },
    { hour: '16:00', utilization: 68 },
    { hour: '17:00', utilization: 45 },
    { hour: '18:00', utilization: 30 }
  ],
  topRooms: [
    { name: 'Lecture Hall 1', bookings: 156 },
    { name: 'Room 301', bookings: 142 },
    { name: 'Computer Lab 2', bookings: 128 },
    { name: 'Seminar Room 5', bookings: 98 },
    { name: 'Meeting Room A', bookings: 87 }
  ]
};

// Time slots for availability calendar
export const generateTimeSlots = () => {
  const times = [];
  for (let hour = 8; hour <= 18; hour++) {
    times.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 18) {
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return times;
};

export const buildings = [
  'All Buildings',
  'Engineering Block A',
  'Engineering Block B',
  'Main Building',
  'Science Block',
  'Library Building',
  'Administration Block'
];

export const roomTypes = [
  'classroom',
  'lecture-hall',
  'lab',
  'meeting-room',
  'seminar-room'
];

export const allFacilities = [
  'Projector',
  'Whiteboard',
  'AC',
  'WiFi',
  'Microphone',
  'Recording Equipment',
  'Computers',
  'Software Lab',
  'TV Display',
  'Conference Phone',
  'Sound System',
  'Lab Equipment',
  'Safety Equipment',
  'Stage'
];
