import { SlashCommandBuilder } from "@discordjs/builders";
import { addJob } from "../../Managers/reminderManager.js";
import { getTimezone } from "../../Managers/timezone.js";
import { parseTimeExpression } from "../../Utils/timeUtils.js";

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
    const remindAt = parseTimeExpression(timeExp, tz);
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
