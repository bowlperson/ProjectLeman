import { SlashCommandBuilder } from "@discordjs/builders";
import { addJob } from "../../Managers/reminderManager.js";
import { getTimezone } from "../../Managers/timezone.js";

function nextFromRule(rule) {
  const now = new Date();
  if (rule.startsWith("every day")) {
    const time = rule.split("at")[1].trim();
    const [h, m] = time.split(":").map(Number);
    const next = new Date(now);
    next.setHours(h, m, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    return next;
  }
  if (rule.startsWith("every")) {
    const parts = rule.split(" ");
    const day = parts[1].toLowerCase();
    const time = parts[3];
    const [h, m] = time.split(":").map(Number);
    const next = new Date(now);
    const dow = ["sun","mon","tue","wed","thu","fri","sat"].indexOf(day);
    let diff = dow - next.getDay();
    if (diff <= 0) diff += 7;
    next.setDate(next.getDate() + diff);
    next.setHours(h, m, 0, 0);
    return next;
  }
  return null;
}

export const commandBase = {
  slashData: new SlashCommandBuilder()
    .setName("repeat")
    .setDescription("Create a recurring reminder")
    .addStringOption((o) => o.setName("message").setDescription("Message").setRequired(true))
    .addStringOption((o) => o.setName("rule").setDescription("Recurrence rule").setRequired(true)),
  async slashRun(client, interaction) {
    const message = interaction.options.getString("message");
    const rule = interaction.options.getString("rule");
    const tz = await getTimezone(interaction.user.id);
    const next = nextFromRule(rule, tz);
    if (!next) {
      return interaction.reply({ content: "Could not parse rule.", ephemeral: true });
    }
    const job = await addJob(client, {
      userId: interaction.user.id,
      channelId: null,
      message,
      remindAt: next,
      repeatRule: rule,
      type: "reminder",
    });
    interaction.reply(`Recurring reminder set. Next: <t:${Math.floor(next.getTime()/1000)}:F>. id: ${job._id}`);
  },
};
