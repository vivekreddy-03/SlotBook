import { db } from "hatchable";
export const access = "user";
export const methods = ["POST"];
export default async function (req, res) {
  const serviceId = String(req.body?.service_id || "");
  const startValue = String(req.body?.start_at || "");
  const name = String(req.body?.customer_name || req.user.name || "").trim().slice(0,100);
  const notes = String(req.body?.notes || "").trim().slice(0,500);
  if (!/^[0-9a-f-]{36}$/i.test(serviceId) || !name || !startValue) return res.status(400).json({ error: "Please provide your name, service, and appointment time." });
  const start = new Date(startValue);
  if (Number.isNaN(start.getTime()) || start.getTime() <= Date.now()) return res.status(400).json({ error: "Choose a future appointment time." });
  const svc = await db.query("SELECT id, name, duration_minutes FROM services WHERE id = $1 AND active = TRUE", [serviceId]);
  if (!svc.rows.length) return res.status(404).json({ error: "That service is no longer available." });
  const end = new Date(start.getTime() + Number(svc.rows[0].duration_minutes)*60000);
  const local = await db.query("SELECT ($1::timestamptz AT TIME ZONE 'Asia/Kolkata')::date AS day, extract(dow from ($1::timestamptz AT TIME ZONE 'Asia/Kolkata'))::int AS weekday, ($1::timestamptz AT TIME ZONE 'Asia/Kolkata')::time AS start_time, ($2::timestamptz AT TIME ZONE 'Asia/Kolkata')::time AS end_time", [start.toISOString(), end.toISOString()]);
  const t = local.rows[0];
  const hrs = await db.query("SELECT opens_at, closes_at, is_open FROM working_hours WHERE weekday = $1", [t.weekday]);
  const holiday = await db.query("SELECT id FROM blocked_dates WHERE day = $1::date", [String(t.day).slice(0,10)]);
  if (!hrs.rows.length || !hrs.rows[0].is_open || t.start_time < hrs.rows[0].opens_at || t.end_time > hrs.rows[0].closes_at || holiday.rows.length) return res.status(409).json({ error: "That time is outside opening hours or unavailable. Please choose another slot." });
  try {
    const { rows } = await db.query("INSERT INTO bookings (service_id, customer_id, customer_email, customer_name, start_at, end_at, notes) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, service_id, customer_name, start_at, end_at, status, notes", [serviceId, req.user.id, req.user.email, name, start.toISOString(), end.toISOString(), notes]);
    res.status(201).json({ booking: { ...rows[0], service_name: svc.rows[0].name } });
  } catch (err) {
    if (String(err?.message || "").includes("bookings_no_overlapping_active") || String(err?.code || "") === "23P01") return res.status(409).json({ error: "That time was just booked by someone else. Please choose another slot." });
    throw err;
  }
}