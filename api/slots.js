import { db } from "hatchable";
export const access = "public";
export const methods = ["GET"];
export default async function (req, res) {
  const date = String(req.query.date || "");
  const serviceId = String(req.query.service_id || "");
  const excludeId = String(req.query.exclude_id || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^[0-9a-f-]{36}$/i.test(serviceId) || (excludeId && !/^[0-9a-f-]{36}$/i.test(excludeId))) return res.status(400).json({ error: "Choose a valid service and date." });
  const parsed = new Date(date + "T12:00:00Z");
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0,10) !== date) return res.status(400).json({ error: "Invalid date." });
  if (date < new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })) return res.json({ slots: [] });
  const serviceResult = await db.query("SELECT duration_minutes FROM services WHERE id = $1 AND active = TRUE", [serviceId]);
  if (!serviceResult.rows.length) return res.status(404).json({ error: "Service not found." });
  const weekday = parsed.getUTCDay();
  const hoursResult = await db.query("SELECT opens_at::text, closes_at::text, is_open FROM working_hours WHERE weekday = $1", [weekday]);
  if (!hoursResult.rows.length || !hoursResult.rows[0].is_open) return res.json({ slots: [] });
  const holiday = await db.query("SELECT id FROM blocked_dates WHERE day = $1::date", [date]);
  if (holiday.rows.length) return res.json({ slots: [] });
  const bookings = await db.query("SELECT start_at, end_at FROM bookings WHERE status = 'confirmed' AND ($2::uuid IS NULL OR id <> $2::uuid) AND start_at < (($1::date + TIME '23:59:59') AT TIME ZONE 'Asia/Kolkata') AND end_at > (($1::date + TIME '00:00:00') AT TIME ZONE 'Asia/Kolkata')", [date, excludeId || null]);
  const [openH, openM] = String(hoursResult.rows[0].opens_at).slice(0,5).split(":").map(Number);
  const [closeH, closeM] = String(hoursResult.rows[0].closes_at).slice(0,5).split(":").map(Number);
  const duration = Number(serviceResult.rows[0].duration_minutes);
  const open = openH * 60 + openM, close = closeH * 60 + closeM;
  const now = Date.now();
  const occupied = bookings.rows.map(b => [new Date(b.start_at).getTime(), new Date(b.end_at).getTime()]);
  const slots = [];
  for (let minute = open; minute + duration <= close; minute += 15) {
    const hour = String(Math.floor(minute/60)).padStart(2,"0"), min = String(minute%60).padStart(2,"0");
    const start = new Date(date + "T" + hour + ":" + min + ":00+05:30");
    const end = new Date(start.getTime() + duration*60000);
    if (start.getTime() <= now) continue;
    if (occupied.some(([a,b]) => start.getTime() < b && end.getTime() > a)) continue;
    slots.push({ start_at: start.toISOString(), label: hour + ":" + min });
  }
  res.json({ slots, date, duration_minutes: duration });
}