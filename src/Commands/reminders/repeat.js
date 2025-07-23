import { SlashCommandBuilder } from "@discordjs/builders";
import { addJob } from "../../Managers/reminderManager.js";
import { getTimezone } from "../../Managers/timezone.js";
import { nextFromRule } from "../../Utils/timeUtils.js";

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
    const next = nextFromRule(rule, new Date(), tz);
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
