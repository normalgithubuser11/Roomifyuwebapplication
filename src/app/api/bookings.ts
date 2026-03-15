import type { Booking } from '../data/mockData';

export type CreateBookingInput = Omit<Booking, 'id'>;
export type UpdateBookingInput = Partial<
  Pick<Booking, 'purpose' | 'attendees' | 'status' | 'notes'>
>;

export async function fetchBookings(userId?: string): Promise<Booking[]> {
  const url = userId ? `/api/bookings?userId=${encodeURIComponent(userId)}` : '/api/bookings';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return (await res.json()) as Booking[];
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to create booking');
  return (await res.json()) as Booking;
}

export async function updateBooking(
  id: string,
  input: UpdateBookingInput,
): Promise<Booking> {
  const res = await fetch(`/api/bookings/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to update booking');
  return (await res.json()) as Booking;
}

export async function deleteBooking(id: string): Promise<void> {
  const res = await fetch(`/api/bookings/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok && res.status !== 204) {
    throw new Error('Failed to delete booking');
  }
}


