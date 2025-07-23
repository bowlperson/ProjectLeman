import { connect } from "../Base/database.js";

const timers = new Map();

export async function loadPending(client) {
  const db = await connect();
  const items = await db.collection("jobs").find({ status: "pending" }).toArray();
  for (const job of items) {
    scheduleJob(client, job);
  }
}

export async function scheduleJob(client, job) {
  const now = Date.now();
  const wait = new Date(job.remindAt).getTime() - now;
  if (wait <= 0) {
    executeJob(client, job);
  } else if (wait < 86400000) {
    const timeout = setTimeout(() => executeJob(client, job), wait);
    timers.set(job._id.toString(), timeout);
  }
}

async function executeJob(client, job) {
  const db = await connect();
  if (job.type === "reminder" || job.type === "task") {
    try {
      const user = await client.users.fetch(job.userId);
      const channel = job.channelId ? await client.channels.fetch(job.channelId) : null;
      const content = job.message;
      if (channel) {
        channel.send(`<@${job.userId}> ${content}`);
      } else {
        user.send(content);
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (job.repeatRule) {
    const next = computeNext(job.repeatRule, new Date(job.remindAt));
    if (next) {
      await db.collection("jobs").updateOne(
        { _id: job._id },
        { $set: { remindAt: next } },
      );
      scheduleJob(client, { ...job, remindAt: next });
      return;
    }
  }

  await db.collection("jobs").updateOne(
    { _id: job._id },
    { $set: { status: "sent" } },
  );
}

function computeNext(rule, date) {
  // very naive rule parser: daily|weekly|monthly at HH:MM
  const parts = rule.split(" ");
  if (parts[0] === "daily") {
    const [h, m] = parts[2].split(":").map(Number);
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    next.setHours(h, m, 0, 0);
    return next;
  }
  if (parts[0] === "weekly") {
    const weekday = parts[1];
    const [h, m] = parts[3].split(":").map(Number);
    const next = new Date(date);
    const dayOfWeek = ["sun","mon","tue","wed","thu","fri","sat"].indexOf(weekday.toLowerCase());
    let diff = dayOfWeek - next.getDay();
    if (diff <= 0) diff += 7;
    next.setDate(next.getDate() + diff);
    next.setHours(h, m, 0, 0);
    return next;
  }
  return null;
}

export function cancelJob(id) {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
}
