import { db } from "hatchable";
export const access = "user";
export const methods = ["POST"];
export default async function (req, res) {
  const id = String(req.body?.id || "");
  const startValue = String(req.body?.start_at || "");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !startValue) return res.status(400).json({ error: "Choose an appointment and a new time." });
  const start = new Date(startValue);
  if (Number.isNaN(start.getTime()) || start.getTime() <= Date.now()) return res.status(400).json({ error: "Choose a future appointment time." });
  const existing = await db.query("SELECT b.id,b.service_id,s.duration_minutes FROM bookings b JOIN services s ON s.id=b.service_id WHERE b.id=$1 AND b.customer_id=$2 AND b.status='confirmed' AND b.start_at>now()", [id, req.user.id]);
  if (!existing.rows.length) return res.status(404).json({ error: "Appointment not found or it can no longer be changed." });
  const end = new Date(start.getTime() + Number(existing.rows[0].duration_minutes)*60000);
  const local = await db.query("SELECT ($1::timestamptz AT TIME ZONE 'Asia/Kolkata')::date AS day, extract(dow from ($1::timestamptz AT TIME ZONE 'Asia/Kolkata'))::int AS weekday, ($1::timestamptz AT TIME ZONE 'Asia/Kolkata')::time AS start_time, ($2::timestamptz AT TIME ZONE 'Asia/Kolkata')::time AS end_time", [start.toISOString(), end.toISOString()]);
  const t = local.rows[0];
  const hrs = await db.query("SELECT opens_at,closes_at,is_open FROM working_hours WHERE weekday=$1", [t.weekday]);
  const holiday = await db.query("SELECT id FROM blocked_dates WHERE day=$1::date", [String(t.day).slice(0,10)]);
  if (!hrs.rows.length || !hrs.rows[0].is_open || t.start_time < hrs.rows[0].opens_at || t.end_time > hrs.rows[0].closes_at || holiday.rows.length) return res.status(409).json({ error: "That time is outside opening hours or unavailable. Please choose another slot." });
  try {
    const { rows } = await db.query("UPDATE bookings SET start_at=$3,end_at=$4 WHERE id=$1 AND customer_id=$2 RETURNING id,start_at,end_at,status", [id, req.user.id, start.toISOString(), end.toISOString()]);
    return res.json({ booking: rows[0] });
  } catch (err) {
    if (String(err?.message || "").includes("bookings_no_overlapping_active") || String(err?.code || "") === "23P01") return res.status(409).json({ error: "That time was just booked by someone else. Please choose another slot." });
    throw err;
  }
}