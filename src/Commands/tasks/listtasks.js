import { SlashCommandBuilder } from "@discordjs/builders";
import { getUserJobs } from "../../Managers/reminderManager.js";

export const commandBase = {
  slashData: new SlashCommandBuilder()
    .setName("listtasks")
    .setDescription("List your pending tasks"),
  async slashRun(client, interaction) {
    const tasks = await getUserJobs(interaction.user.id, "task");
    if (!tasks.length) {
      return interaction.reply({ content: "No tasks.", ephemeral: true });
    }
    const lines = tasks.map((t) => `${t._id} - <t:${Math.floor(new Date(t.remindAt).getTime()/1000)}:F> - ${t.message}`);
    interaction.reply({ content: lines.join("\n"), ephemeral: true });
  },
};
