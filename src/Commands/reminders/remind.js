import { SlashCommandBuilder } from "@discordjs/builders";
import { addJob } from "../../Managers/reminderManager.js";
import { getTimezone } from "../../Managers/timezone.js";
import { parseTimeExpression } from "../../Utils/timeUtils.js";

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
    const remindAt = parseTimeExpression(timeExp, tz);
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
