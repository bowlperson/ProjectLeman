import { SlashCommandBuilder } from "@discordjs/builders";
import { setTimezone } from "../../Managers/timezone.js";

export const commandBase = {
  slashData: new SlashCommandBuilder()
    .setName("settimezone")
    .setDescription("Set your timezone, e.g. UTC or UTC+2")
    .addStringOption((o) => o.setName("zone").setDescription("Timezone").setRequired(true)),
  async slashRun(client, interaction) {
    const zone = interaction.options.getString("zone");
    await setTimezone(interaction.user.id, zone);
    interaction.reply({ content: `Timezone set to ${zone}`, ephemeral: true });
  },
};
