import { SlashCommandBuilder } from "@discordjs/builders";
import { addJob } from "../../Managers/reminderManager.js";
import { getTimezone } from "../../Managers/timezone.js";
import { parse } from "url";

function parseTime(input, tz) {
  input = input.trim();
  const now = new Date();
  if (input.startsWith("in")) {
    const parts = input.split(/ +/);
    const amount = parseInt(parts[1]);
    const unit = parts[2];
    if (unit.startsWith("min")) return new Date(now.getTime() + amount * 60000);
    if (unit.startsWith("hour")) return new Date(now.getTime() + amount * 3600000);
    if (unit.startsWith("day")) return new Date(now.getTime() + amount * 86400000);
  }
  const ts = Date.parse(input);
  if (!isNaN(ts)) return new Date(ts);
  return null;
}

export const commandBase = {
  slashData: new SlashCommandBuilder()
    .setName("remind")
    .setDescription("Remind another user")
    .addUserOption((o) => o.setName("user").setDescription("Target user").setRequired(true))
    .addStringOption((o) => o.setName("message").setDescription("Message").setRequired(true))
    .addStringOption((o) => o.setName("time").setDescription("When to remind").setRequired(true)),
  async slashRun(client, interaction) {
    const user = interaction.options.getUser("user");
    const message = interaction.options.getString("message");
    const timeExp = interaction.options.getString("time");
    const tz = await getTimezone(user.id);
    const remindAt = parseTime(timeExp, tz);
    if (!remindAt) {
      return interaction.reply({ content: "Could not parse time.", ephemeral: true });
    }
    const job = await addJob(client, {
      userId: user.id,
      channelId: interaction.channelId,
      message,
      remindAt,
      type: "reminder",
    });
    interaction.reply(`Reminder set for <@${user.id}> at <t:${Math.floor(remindAt.getTime()/1000)}:F>. id: ${job._id}`);
  },
};
