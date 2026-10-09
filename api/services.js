import { db } from "hatchable";
export const access = "public";
export const methods = ["GET"];
export default async function (req, res) {
  const { rows } = await db.query("SELECT id, name, description, duration_minutes, price_cents FROM services WHERE active = TRUE ORDER BY created_at, name");
  res.json({ services: rows });
}