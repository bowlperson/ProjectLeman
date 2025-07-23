import { SlashCommandBuilder } from "@discordjs/builders";
import { deleteJob } from "../../Managers/reminderManager.js";

export const commandBase = {
  slashData: new SlashCommandBuilder()
    .setName("deletetask")
    .setDescription("Delete a task")
    .addStringOption((o) => o.setName("id").setDescription("Task id").setRequired(true)),
  async slashRun(client, interaction) {
    const id = interaction.options.getString("id");
    await deleteJob(id);
    interaction.reply({ content: `Deleted task ${id}`, ephemeral: true });
  },
};
