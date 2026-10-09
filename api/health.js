import { auth } from "hatchable";
export const access = "public";
export const methods = ["GET"];
export default async function (req, res) {
  const user = await auth.getUser(req);
  res.json({ ok: true, app: "SlotBook", version: 2, signedIn: Boolean(user), timestamp: new Date().toISOString() });
}