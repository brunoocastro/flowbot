import Discord from "discord.js";
import getMomentString from "../Utils/DateHelper";

export default class DiscordProvider {
  private discord: Discord.Client;

  constructor() {
    this.discord = new Discord.Client({
      intents: [Discord.Intents.FLAGS.GUILDS],
      presence: { status: "online" },
    });

    this.discord.on("ready", () => {
      console.log(
        `${getMomentString()} - BOT Online como ${this.discord.user.tag}!`
      );
    });

    this.discord.login(process.env.DISCORD_TOKEN);

    this.startListeners();
  }

  startListeners = async () => {
    console.log(await this.discord.guilds.fetch());
    console.log(this.discord.channels);

    this.discord.on("message", (message: Discord.Message) => {
      console.log(message);
      if (message.author.bot) return;
      message.reply(`${message.content} teu cu`);
    });

    this.discord.on("interactionCreate", async (interaction) => {
      console.log(interaction.user);
      if (!interaction.isCommand()) return;

      const { commandName } = interaction;

      if (commandName === "ping") {
        await interaction.reply("Pong!");
      } else if (commandName === "server") {
        await interaction.reply("Server info.");
      } else if (commandName === "user") {
        await interaction.reply("User info.");
      }
    });
  };
}
