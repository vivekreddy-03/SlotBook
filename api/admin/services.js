import { db } from "hatchable";
export const access = "admin";
export const methods = ["GET","POST","PUT","DELETE"];
export default async function (req, res) {
  if (req.method === "GET") {
    const { rows } = await db.query("SELECT id,name,description,duration_minutes,price_cents,active FROM services ORDER BY created_at DESC");
    return res.json({ services: rows });
  }
  if (req.method === "POST" || req.method === "PUT") {
    const id = String(req.body?.id || "");
    const name = String(req.body?.name || "").trim().slice(0,120);
    const description = String(req.body?.description || "").trim().slice(0,1000);
    const duration = Number(req.body?.duration_minutes);
    const price = Number(req.body?.price_cents);
    if (!name || !Number.isInteger(duration) || duration < 15 || duration > 240 || !Number.isInteger(price) || price < 0) return res.status(400).json({ error: "Enter a name, duration from 15–240 minutes, and a valid price." });
    if (req.method === "POST") {
      const { rows } = await db.query("INSERT INTO services (name,description,duration_minutes,price_cents) VALUES ($1,$2,$3,$4) RETURNING *", [name,description,duration,price]);
      return res.status(201).json({ service: rows[0] });
    }
    if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: "Choose a valid service." });
    const { rows } = await db.query("UPDATE services SET name=$2,description=$3,duration_minutes=$4,price_cents=$5 WHERE id=$1 RETURNING *", [id,name,description,duration,price]);
    return rows.length ? res.json({ service: rows[0] }) : res.status(404).json({ error: "Service not found." });
  }
  const id = String(req.body?.id || "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: "Choose a valid service." });
  const { rows } = await db.query("UPDATE services SET active = FALSE WHERE id = $1 RETURNING id", [id]);
  return rows.length ? res.json({ ok: true }) : res.status(404).json({ error: "Service not found." });
}