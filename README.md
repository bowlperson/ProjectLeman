# Example Discord Bot Handler - V14

- **Project built on `discord.js` v14.**
- **Minimum required Node.js version: v18**
- **Example command setup can be found in [`src/Commands/info/ping.js`](https://github.com/memte/ExampleBot/blob/v14/src/Commands/info/ping.js).**  
  For more details, visit the [Discord.js Guide](https://discordjs.guide/slash-commands/advanced-creation.html).

- **Note: Remember to configure your settings in the [`config.js`](https://github.com/memte/ExampleBot/blob/v14/src/Base/config.js) file and don't forget to prepare a `.env` file similar to [`.env.example`](https://github.com/memte/ExampleBot/blob/v14/.env.example)**!

## Setup

1. Copy `.env.example` to `.env` and provide your configuration values:
   - `BOT_TOKEN` – Discord bot token
   - `MONGO_URI` – MongoDB connection string
   - `MONGO_DB` – database name
   - `CLIENT_ID` *(optional)* – required only if you register commands without logging in

The client ID is automatically derived from the token when the bot starts, so it's generally not needed unless you use a manual deployment script.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=memte/ExampleBot&type=Date)](https://www.star-history.com/#memte/ExampleBot&Date)

## 🌟 Support the Project

If you find this project helpful, consider giving it a ⭐ on GitHub!

![Vote](https://user-images.githubusercontent.com/63320170/175336722-373eaf92-1454-4bce-b97c-e8a629c2628e.png)

### [Click here for the Discord.js V13 version.](https://github.com/memte/ExampleBot/tree/v13)
