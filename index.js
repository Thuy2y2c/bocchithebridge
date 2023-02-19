// hey, its cart here. i think i fucked your project!
require('dotenv').config();

// load mineflayer
const mineflayer = require('mineflayer');

// important stuffs go here ok?
const { username, livechat } = require('./config.json');

// load discord.js
const { Client, GatewayIntentBits } = require('discord.js')
const { MessageContent, GuildMessages, Guilds } = GatewayIntentBits

const token = process.env.TOKEN

// create new discord client that can see what servers the bot is in, as well as the messages in those servers
const client = new Client({ intents: [Guilds, GuildMessages, MessageContent] })
client.login(token)

const botArgs = {
    host: 'localhost',
    port: '52996',
    username: username,
    version: '1.12.2'
};

// when discord client is ready, send login message
    client.once('ready', (c) => {
      console.log(`Discord bot logged in as ${c.user.tag}`)
      channel = client.channels.cache.get(livechat)
      if (!channel) {
        console.log('Channel not found')
      process.exit(1)
    }
  })

const initBot = () => {

    // Setup bot connection
    let bot = mineflayer.createBot(botArgs);

    bot.on('login', () => {
        console.log(`Logged in as ${bot.username}`);
    });

    client.on('messageCreate', (message) => {
        // Only handle messages in specified channel
        if (message.channel.id !== channel.id) return
        // Ignore messages from the bot itself
        if (message.author.id === client.user.id) return
        console.log(`${message.author.tag} chatted : ${message.content}`)
        bot.chat(`${message.author.tag}: ${message.content}`)
      })

    // Redirect in-game messages to Discord channel
    bot.on('message', (message) => {
        console.log(message.toString())
        channel.send(message.toString())
      })  

    bot.on('end', () => {
        console.log(`Bot got disconnected. Reconnecting..`);

        // Attempt to reconnect
        setTimeout(initBot, 5000);
    });

    bot.on('error', (err) => {
        if (err.code === 'ECONNREFUSED') {
            console.log(`Failed to connect to ${err.address}:${err.port}`)
        }
        else {
            console.log(`Unhandled error: ${err}`);
        }
    });
};

initBot();
