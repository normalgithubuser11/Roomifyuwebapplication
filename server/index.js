import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const PORT = Number(process.env.API_PORT || 3001);

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const pool = mysql.createPool({
  host: requiredEnv('MYSQL_HOST'),
  port: Number(process.env.MYSQL_PORT || 3306),
  user: requiredEnv('MYSQL_USER'),
  password: requiredEnv('MYSQL_PASSWORD'),
  database: requiredEnv('MYSQL_DATABASE'),
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id VARCHAR(36) PRIMARY KEY,
      room_id VARCHAR(64) NOT NULL,
      room_name VARCHAR(255) NOT NULL,
      building VARCHAR(255) NOT NULL,
      user_id VARCHAR(64) NOT NULL,
      user_name VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      purpose TEXT NOT NULL,
      attendees INT NOT NULL,
      status ENUM('confirmed','pending','rejected','cancelled') NOT NULL,
      equipment JSON NOT NULL,
      notes TEXT NULL,
      is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function isValidDateYYYYMMDD(s) {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function isValidTimeHHMM(s) {
  return typeof s === 'string' && /^\d{2}:\d{2}$/.test(s);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/bookings', async (req, res) => {
  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
  try {
    const [rows] = await pool.query(
      `
        SELECT
          id,
          room_id AS roomId,
          user_id AS userId,
          user_name AS userName,
          room_name AS roomName,
          building,
          DATE_FORMAT(date, '%Y-%m-%d') AS date,
          DATE_FORMAT(start_time, '%H:%i') AS startTime,
          DATE_FORMAT(end_time, '%H:%i') AS endTime,
          purpose,
          attendees,
          status,
          equipment,
          notes,
          is_recurring AS isRecurring
        FROM bookings
        ${userId ? 'WHERE user_id = :userId' : ''}
        ORDER BY date ASC, start_time ASC
      `,
      userId ? { userId } : {}
    );
    const normalized = rows.map((r) => ({
      ...r,
      equipment: Array.isArray(r.equipment) ? r.equipment : JSON.parse(r.equipment ?? '[]'),
      isRecurring: Boolean(r.isRecurring),
    }));
    res.json(normalized);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load bookings' });
  }
});

app.post('/api/bookings', async (req, res) => {
  const b = req.body ?? {};

  const {
    roomId,
    roomName,
    building,
    userId,
    userName,
    date,
    startTime,
    endTime,
    purpose,
    attendees,
    status,
    equipment,
    notes,
    isRecurring,
  } = b;

  if (
    typeof roomId !== 'string' ||
    typeof roomName !== 'string' ||
    typeof building !== 'string' ||
    typeof userId !== 'string' ||
    typeof userName !== 'string' ||
    !isValidDateYYYYMMDD(date) ||
    !isValidTimeHHMM(startTime) ||
    !isValidTimeHHMM(endTime) ||
    typeof purpose !== 'string' ||
    !Number.isFinite(Number(attendees)) ||
    !['confirmed', 'pending', 'rejected', 'cancelled'].includes(status) ||
    !Array.isArray(equipment) ||
    typeof isRecurring !== 'boolean'
  ) {
    return res.status(400).json({ error: 'Invalid booking payload' });
  }

  const id = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`).toString();

  try {
    await pool.query(
      `
        INSERT INTO bookings (
          id,
          room_id,
          room_name,
          building,
          user_id,
          user_name,
          date,
          start_time,
          end_time,
          purpose,
          attendees,
          status,
          equipment,
          notes,
          is_recurring
        ) VALUES (
          :id,
          :roomId,
          :roomName,
          :building,
          :userId,
          :userName,
          :date,
          :startTime,
          :endTime,
          :purpose,
          :attendees,
          :status,
          :equipment,
          :notes,
          :isRecurring
        )
      `,
      {
        id,
        roomId,
        roomName,
        building,
        userId,
        userName,
        date,
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
        purpose,
        attendees: Number(attendees),
        status,
        equipment: JSON.stringify(equipment),
        notes: typeof notes === 'string' && notes.trim() ? notes.trim() : null,
        isRecurring,
      }
    );

    res.status(201).json({
      id,
      roomId,
      userId,
      userName,
      roomName,
      building,
      date,
      startTime,
      endTime,
      purpose,
      attendees: Number(attendees),
      status,
      equipment,
      notes: typeof notes === 'string' && notes.trim() ? notes.trim() : undefined,
      isRecurring,
    });
  } catch (_e) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

app.patch('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const {
    purpose,
    attendees,
    status,
    notes,
  } = req.body ?? {};

  if (!id) {
    return res.status(400).json({ error: 'Missing booking id' });
  }

  const fields = [];
  const params = { id };

  if (typeof purpose === 'string') {
    fields.push('purpose = :purpose');
    params.purpose = purpose;
  }
  if (attendees !== undefined) {
    if (!Number.isFinite(Number(attendees))) {
      return res.status(400).json({ error: 'Invalid attendees' });
    }
    fields.push('attendees = :attendees');
    params.attendees = Number(attendees);
  }
  if (typeof status === 'string') {
    if (!['confirmed', 'pending', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    fields.push('status = :status');
    params.status = status;
  }
  if (notes !== undefined) {
    fields.push('notes = :notes');
    params.notes = typeof notes === 'string' && notes.trim() ? notes.trim() : null;
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No updatable fields provided' });
  }

  try {
    const [result] = await pool.query(
      `
        UPDATE bookings
        SET ${fields.join(', ')}
        WHERE id = :id
      `,
      params,
    );

    // @ts-ignore - mysql2 result typing
    if (!result.affectedRows) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const [rows] = await pool.query(
      `
        SELECT
          id,
          room_id AS roomId,
          user_id AS userId,
          user_name AS userName,
          room_name AS roomName,
          building,
          DATE_FORMAT(date, '%Y-%m-%d') AS date,
          DATE_FORMAT(start_time, '%H:%i') AS startTime,
          DATE_FORMAT(end_time, '%H:%i') AS endTime,
          purpose,
          attendees,
          status,
          equipment,
          notes,
          is_recurring AS isRecurring
        FROM bookings
        WHERE id = :id
      `,
      { id },
    );

    if (!Array.isArray(rows) || !rows[0]) {
      return res.status(404).json({ error: 'Booking not found after update' });
    }

    const row = rows[0];
    const normalized = {
      ...row,
      equipment: Array.isArray(row.equipment) ? row.equipment : JSON.parse(row.equipment ?? '[]'),
      isRecurring: Boolean(row.isRecurring),
    };

    res.json(normalized);
  } catch (_e) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing booking id' });
  }
  try {
    const [result] = await pool.query(
      `
        DELETE FROM bookings
        WHERE id = :id
      `,
      { id },
    );
    // @ts-ignore - mysql2 result typing
    if (!result.affectedRows) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(204).send();
  } catch (_e) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

await ensureSchema();
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`RoomifyU API listening on http://localhost:${PORT}`);
});

