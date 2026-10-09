import { db } from "hatchable";
export const access = "admin";
export const methods = ["GET","PUT"];
export default async function (req, res) {
  if (req.method === "GET") {
    const { rows } = await db.query("SELECT b.id,b.customer_name,b.customer_email,b.start_at,b.end_at,b.status,b.notes,s.name AS service_name FROM bookings b JOIN services s ON s.id=b.service_id ORDER BY b.start_at DESC LIMIT 250");
    return res.json({ bookings: rows });
  }
  const id = String(req.body?.id || ""), status = String(req.body?.status || "");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !["confirmed","cancelled","completed"].includes(status)) return res.status(400).json({ error: "Choose an appointment and a valid status." });
  const { rows } = await db.query("UPDATE bookings SET status=$2 WHERE id=$1 RETURNING id,status", [id,status]);
  return rows.length ? res.json({ booking: rows[0] }) : res.status(404).json({ error: "Appointment not found." });
}