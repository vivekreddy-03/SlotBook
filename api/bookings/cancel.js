import { db } from "hatchable";
export const access = "user";
export const methods = ["POST"];
export default async function (req, res) {
  const id = String(req.body?.id || "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: "Choose a valid appointment." });
  const { rows } = await db.query("UPDATE bookings SET status = 'cancelled' WHERE id = $1 AND customer_id = $2 AND status = 'confirmed' AND start_at > now() RETURNING id", [id, req.user.id]);
  if (!rows.length) return res.status(404).json({ error: "Appointment not found or it can no longer be cancelled." });
  res.json({ ok: true });
}