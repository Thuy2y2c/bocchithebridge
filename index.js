require('dotenv').config();

// load mineflayer
const mineflayer = require('mineflayer');

// important stuffs go here ok?
const { username, livechat } = require('./config.json');

// load discord.js
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js')
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

    bot.once('login', () => {
      console.log(`Logged in as ${bot.username}`);
    });

    client.on('messageCreate', (message) => {
        // Only handle messages in specified channel
        if (message.channel.id !== channel.id) return
        // Ignore messages from the bot itself
        if (message.author.id === client.user.id) return
        const userMessage = message.content;
        const illegalChar = '§';
      
        if (userMessage.includes(illegalChar)) {
          message.reply('yo bro that unicode doesnt exist on the craft');
        } else {
          console.log(`${message.author.tag} chatted : ${userMessage}`);
          bot.chat(`[${message.author.tag}] ${userMessage} | bocchithebridge`);
        }
      });

    // Redirect in-game messages to Discord channel
    bot.on('message', (message) => {
        console.log(message.toString())
        const chatEmbed = new EmbedBuilder()
          .setColor("NotQuiteBlack")
          .setTitle(message.toString())
        channel.send({ embeds: [chatEmbed]});
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
