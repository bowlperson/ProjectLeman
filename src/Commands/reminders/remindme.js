import { SlashCommandBuilder } from "@discordjs/builders";
import { addJob } from "../../Managers/reminderManager.js";
import { getTimezone } from "../../Managers/timezone.js";

function parseTime(input, tz) {
  input = input.trim();
  const now = new Date();
  const offset = 0; // naive: ignoring timezone difference
  if (input.startsWith("in")) {
    const parts = input.split(/ +/);
    const amount = parseInt(parts[1]);
    const unit = parts[2];
    if (unit.startsWith("min")) return new Date(now.getTime() + amount * 60000);
    if (unit.startsWith("hour")) return new Date(now.getTime() + amount * 3600000);
    if (unit.startsWith("day")) return new Date(now.getTime() + amount * 86400000);
  }
  if (input.startsWith("tomorrow")) {
    const time = input.split("at")[1].trim();
    const [h, m] = time.split(":").map(Number);
    const date = new Date(now.getTime() + 86400000);
    date.setHours(h, m, 0, 0);
    return date;
  }
  if (input.startsWith("at")) {
    const time = input.split("at")[1].trim();
    const [h, m] = time.split(":").map(Number);
    const date = new Date(now);
    date.setHours(h, m, 0, 0);
    if (date < now) date.setDate(date.getDate() + 1);
    return date;
  }
  const ts = Date.parse(input);
  if (!isNaN(ts)) return new Date(ts);
  return null;
}

export const commandBase = {
  slashData: new SlashCommandBuilder()
    .setName("remindme")
    .setDescription("Set a personal reminder")
    .addStringOption((o) =>
      o.setName("message").setDescription("Reminder message").setRequired(true),
    )
    .addStringOption((o) =>
      o
        .setName("time")
        .setDescription('Time expression like "in 2 hours"')
        .setRequired(true),
    ),
  async slashRun(client, interaction) {
    const message = interaction.options.getString("message");
    const timeExp = interaction.options.getString("time");
    const tz = await getTimezone(interaction.user.id);
    const remindAt = parseTime(timeExp, tz);
    if (!remindAt) {
      return interaction.reply({ content: "Could not parse time.", ephemeral: true });
    }
    const job = await addJob(client, {
      userId: interaction.user.id,
      channelId: null,
      message,
      remindAt,
      type: "reminder",
    });
    interaction.reply({ content: `Reminder set for <t:${Math.floor(remindAt.getTime()/1000)}:F>. id: ${job._id}` });
  },
};
