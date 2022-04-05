import Discord from "discord.js";
import DiscordChannels from "../Constants/Discord";
import getMomentString from "../Utils/DateHelper";

// import {} from '@discord.js/builders'
export default class DiscordProvider {
  private discord: Discord.Client;

  constructor() {
    this.discord = new Discord.Client();
    //   {
    //   intents: [Discord.Intents.FLAGS.GUILDS],
    //   presence: { status: "online" },
    // });

    this.discord.once("ready", () => {
      console.log(
        `${getMomentString()} - BOT Online como ${this.discord.user.tag}!`
      );
    });

    this.discord.login(process.env.DISCORD_TOKEN);

    this.startListeners();
  }

  startListeners = async () => {
    // console.log(await this.discord.guilds.fetch());
    console.log(this.discord.guilds);

    this.discord.on("message", async (message: Discord.Message) => {
      if (message.author.bot) return;

      // console.log(message);
      // message.reply(`${message.content} teu cu`);
      // if(message.)
      // if (!message.channel.name.includes("bot-commands"))
      // DiscordChannels.includes('')
      // console.log("Dados", message.author.)

      switch (message.content) {
        case "teste":
          message.reply("Funciona");
          break;
        case "george":
          if (message.author.username.toLowerCase().includes("george")) {
            message.reply("Sdds de ontem a noite, risos");
          } else {
            message.reply("Comi ele ontem");
          }
          break;
        default:
          break;
      }
    });

  //   this.discord.on("interactionCreate", async (interaction) => {
  //     console.log(interaction.user);
  //     if (!interaction.isCommand()) return;

  //     const { commandName } = interaction;

  //     if (commandName === "ping") {
  //       await interaction.reply("Pong!");
  //     } else if (commandName === "server") {
  //       await interaction.reply("Server info.");
  //     } else if (commandName === "user") {
  //       await interaction.reply("User info.");
  //     }
  //   });
  };
}
