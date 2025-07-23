import { ObjectId } from "mongodb";
import { connect } from "../Base/database.js";
import { scheduleJob, cancelJob } from "./scheduler.js";

export async function addJob(client, data) {
  const db = await connect();
  const job = {
    userId: data.userId,
    channelId: data.channelId || null,
    message: data.message,
    remindAt: data.remindAt,
    createdAt: new Date(),
    repeatRule: data.repeatRule || null,
    type: data.type || "reminder",
    status: "pending",
  };
  const res = await db.collection("jobs").insertOne(job);
  job._id = res.insertedId;
  scheduleJob(client, job);
  return job;
}

export async function deleteJob(id) {
  const db = await connect();
  await db.collection("jobs").updateOne({ _id: new ObjectId(id) }, { $set: { status: "deleted" } });
  cancelJob(id);
}

export async function getUserJobs(userId, type) {
  const db = await connect();
  return db.collection("jobs").find({ userId, type, status: "pending" }).toArray();
}
