// hey is thuy here, the code is currently messy and packed up with embeds and stuffs, don't worry i will add a handler so
// the code will be easier to look with and your eyes won't gonna explode. Thanks!

require('dotenv').config();

const fs = require('fs');
const path = require('path');

// load mineflayer
const mineflayer = require('mineflayer');

// important stuffs go here ok?
const { username, livechat, prefix, discordprefix } = require('./config.json');

// load discord.js
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js')
const { MessageContent, GuildMessages, Guilds } = GatewayIntentBits

// load plugins for Mineflayer
const tpsPlugin = require('mineflayer-tps')(mineflayer);

const token = process.env.TOKEN

// create new discord client that can see what servers the bot is in, as well as the messages in those servers
const client = new Client({ intents: [Guilds, GuildMessages, MessageContent] })
client.login(token)

const botArgs = {
    host: 'localhost',
    port: '50632',
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

/* when discord client is ready, start initBot
   this should prevent "Cannot read properties of undefined (reading 'send')" is
   
   Why?
   I saw that when Discord.js hasn't finished login into the Discord token when the bot receives 
   in-game chat messages right before Discord.js finished login-ed into the bot, 'send' isn't defined yet so it just bugs out!
   
   grammar is bad*/
   const discordReady = () => {
    return new Promise((resolve) => {
      client.once('ready', (c) => {
        console.log(`Discord bot logged in as ${c.user.tag}, starting Mineflayer..`);
        channel = client.channels.cache.get(livechat);
        if (!channel) {
          console.log('Channel not found');
          process.exit(1);
        }
        resolve();
      });
    });
  };

const initBot = async () => {
    // Wait for Discord.js to log into the Discord Token
    await discordReady();

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

  // Define the commands folder path
const commandsFolder = path.join(__dirname, 'ingame-commands');

const commandFiles = fs.readdirSync('./ingame-commands'); // !! lol !!
const commandNames = commandFiles.map(file => file.replace('.js', '')); // create an array of file names without the file extension
const commandString = commandNames.join(', '); // join the array elements into a comma-separated string, example : test, help, thuy

// Listen for chat messages
bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    
  // Check if the message starts with '!'
  if (message.startsWith(prefix)) {
    // Split the message into command and arguments
    const [command, ...args] = message.slice(1).split(' ');

    // Get the path of the command file
    const commandPath = path.join(commandsFolder, `${command}.js`);

    // Check if the command file exists
    if (fs.existsSync(commandPath)) {
      // Require the command file and execute the command function with the bot instance and arguments
      const commandFunction = require(commandPath);
      commandFunction(bot, commandString,...args);
    } else {
      // If the command file doesn't exist, reply with an error message
      bot.chat(`Unknown command: ${command}`);
    }
  }
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
