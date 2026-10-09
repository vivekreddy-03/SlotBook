import { db } from "hatchable";
export const access = "admin";
export const methods = ["GET","POST","DELETE","PUT"];
export default async function (req, res) {
  if (req.method === "GET") {
    const [hours, blocked] = await Promise.all([
      db.query("SELECT weekday,opens_at::text,closes_at::text,is_open FROM working_hours ORDER BY weekday"),
      db.query("SELECT id,day,reason FROM blocked_dates ORDER BY day")
    ]);
    return res.json({ hours: hours.rows, blocked_dates: blocked.rows });
  }
  if (req.method === "POST") {
    const day = String(req.body?.day || ""), reason = String(req.body?.reason || "Unavailable").trim().slice(0,160);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return res.status(400).json({ error: "Choose a valid date." });
    const { rows } = await db.query("INSERT INTO blocked_dates (day,reason) VALUES ($1::date,$2) ON CONFLICT (day) DO UPDATE SET reason=EXCLUDED.reason RETURNING id,day,reason", [day,reason || "Unavailable"]);
    return res.status(201).json({ blocked_date: rows[0] });
  }
  if (req.method === "DELETE") {
    const id = String(req.body?.id || "");
    if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: "Choose a valid blocked date." });
    await db.query("DELETE FROM blocked_dates WHERE id=$1", [id]);
    return res.json({ ok: true });
  }
  const weekday = Number(req.body?.weekday), opens = String(req.body?.opens_at || ""), closes = String(req.body?.closes_at || ""), isOpen = Boolean(req.body?.is_open);
  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6 || !/^\d{2}:\d{2}$/.test(opens) || !/^\d{2}:\d{2}$/.test(closes) || opens >= closes) return res.status(400).json({ error: "Choose valid opening and closing times." });
  const { rows } = await db.query("INSERT INTO working_hours (weekday,opens_at,closes_at,is_open) VALUES ($1,$2::time,$3::time,$4) ON CONFLICT (weekday) DO UPDATE SET opens_at=EXCLUDED.opens_at,closes_at=EXCLUDED.closes_at,is_open=EXCLUDED.is_open RETURNING weekday,opens_at::text,closes_at::text,is_open", [weekday,opens,closes,isOpen]);
  res.json({ hours: rows[0] });
}