// hey is thuy here, the code is currently messy and packed up with embeds and stuffs, don't worry i will add a handler, eventhandler so
// the code will be easier to look with and your eyes won't gonna explode. Thanks!

require('dotenv').config();
const fs = require('fs');

// load mineflayer
const mineflayer = require('mineflayer');

// important stuffs go here ok?
const { username, livechat, prefix, discordprefix } = require('./config.json');

// load discord.js
const { Client, GatewayIntentBits, EmbedBuilder, Collection } = require('discord.js')
const { MessageContent, GuildMessages, Guilds } = GatewayIntentBits

// load plugins for Mineflayer
const tpsPlugin = require('mineflayer-tps')(mineflayer);

const token = process.env.TOKEN

// create new discord client that can see what servers the bot is in, as well as the messages in those servers
const client = new Client({ intents: [Guilds, GuildMessages, MessageContent] })
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const botArgs = {
    host: 'localhost',
    port: '63398',
    username: username,
    version: '1.12.2'
};

console.log(` `+
    `\n Thank you for using Thuy2y2c/bocchithebridge project` +
    `\n         Version: ${require('./package.json').version}` + // Thanks OggyTheCode for this feature
    `\n         Ingame prefix: ${prefix}` +
    `\n         Discord prefix: ${discordprefix}` +
    `\n         Server: ${botArgs.host}:${botArgs.port}` +
    `\n         Bot username: ${username}` +
    `\n `
);

// checks for prefixes
  if (!prefix) {
    console.log('Ingame prefix not found') 
  process.exit(1)
  }
  if (!discordprefix) {
  console.log('Discord prefix not found')  
process.exit(1)
}

// define the channel variable outside the event handler
let channel;

// when discord client is ready, send login message
    client.once('ready', (c) => {
      console.log(`Discord bot logged in as ${c.user.tag}`)
      channel = client.channels.cache.get(livechat)
      if (!channel) {
        console.log('Channel not found')
      process.exit(1)
    }
  })

// discword uwu
client.on('messageCreate', message => {
  if (!message.content.startsWith(discordprefix) || message.author.bot) return;
  const args = message.content.slice(discordprefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  if (!client.commands.has(commandName)) return;
  const command = client.commands.get(commandName);
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});


const initBot = () => {

    // Setup bot connection
    let bot = mineflayer.createBot(botArgs);

    // Load plugins
    bot.loadPlugin(tpsPlugin)

    bot.once('login', () => {
      console.log(`Logged in as ${bot.username}`);
    });

    bot.once('spawn', () => {
      console.log(`Successfully connected to ${botArgs.host}:${botArgs.port}`)
    });
    // Hey, Snoop Dog here. Your code sucks!
    bot.on('spawn', () => {
      console.log(`${bot.username} has been spawned.`)
      console.log('Bot has spawned/respawned in : ' + Math.round(bot.entity.position.x), Math.round(bot.entity.position.y), Math.round(bot.entity.position.z))
      // check if the channel is defined before sending the message
      if (channel) {
        const spawnEmbed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`${bot.username} has been spawned/respawned`)
        channel.send({ embeds: [spawnEmbed] });
    }
  })

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
          .setColor("Random")
          .setTitle(message.toString())
        channel.send({ embeds: [chatEmbed]});
      })  

      bot.on('death', () => { // death skull skull
        console.log(
           `Bot died.. respawning..`
        );
     });    

    bot.on('end', () => {
        console.log(`Bot got disconnected. Reconnecting..`);
        // check if the channel is defined before sending the message
        if (channel) {
          const spawnEmbed = new EmbedBuilder()
            .setColor("Red")
            .setTitle(`Bot got disconnected. Reconnecting..`)
        channel.send({ embeds: [spawnEmbed] });
    }
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
client.login(token)
