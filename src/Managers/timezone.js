import { connect } from "../Base/database.js";

export async function setTimezone(userId, tz) {
  const db = await connect();
  await db.collection("timezones").updateOne({ userId }, { $set: { tz } }, { upsert: true });
}

export async function getTimezone(userId) {
  const db = await connect();
  const doc = await db.collection("timezones").findOne({ userId });
  return doc ? doc.tz : "UTC";
}
