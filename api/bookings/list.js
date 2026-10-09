import { db } from "hatchable";
export const access = "user";
export const methods = ["GET"];
export default async function (req, res) {
  const { rows } = await db.query("SELECT b.id, b.service_id, b.customer_name, b.start_at, b.end_at, b.status, b.notes, s.name AS service_name, s.duration_minutes, s.price_cents FROM bookings b JOIN services s ON s.id = b.service_id WHERE b.customer_id = $1 ORDER BY b.start_at DESC LIMIT 100", [req.user.id]);
  res.json({ bookings: rows });
}