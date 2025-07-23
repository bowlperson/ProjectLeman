import { SlashCommandBuilder } from "@discordjs/builders";
import { addJob } from "../../Managers/reminderManager.js";
import { getTimezone } from "../../Managers/timezone.js";
import { parseDateString } from "../../Utils/timeUtils.js";

export const commandBase = {
  slashData: new SlashCommandBuilder()
    .setName("addtask")
    .setDescription("Add a task with due date")
    .addStringOption((o) => o.setName("description").setDescription("Description").setRequired(true))
    .addStringOption((o) => o.setName("due").setDescription("Due date/time").setRequired(true)),
  async slashRun(client, interaction) {
    const desc = interaction.options.getString("description");
    const dueStr = interaction.options.getString("due");
    const tz = await getTimezone(interaction.user.id);
    const due = parseDateString(dueStr, tz);
    if (!due) {
      return interaction.reply({ content: "Could not parse due date.", ephemeral: true });
    }
    const job = await addJob(client, {
      userId: interaction.user.id,
      channelId: null,
      message: `Task due: ${desc}`,
      remindAt: due,
      type: "task",
    });
    interaction.reply(`Task added for <t:${Math.floor(due.getTime()/1000)}:F>. id: ${job._id}`);
  },
};
