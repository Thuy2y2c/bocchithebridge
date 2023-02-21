// hey is thuy here, the code is currently messy and packed up with embeds and stuffs, don't worry i will add a handler so
// the code will be easier to look with and your eyes won't gonna explode. Thanks!

require('dotenv').config();

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
    host: 'bocchithebot.aternos.me',
    port: '60320',
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
 // i am bad at making handlers so i put it here temporary :)
  client.on('messageCreate', message => {
    if (channel) {
    const dchelpEmbed = new EmbedBuilder()
    .setColor("Aqua")
    .setTitle('bocchithebridge - help')
    .setURL('https://github.com/Thuy2y2c/bocchithebridge')
    .addFields(
      { name: `Ingame commands - [${prefix}]`, value: '```nothing for now. ```' },
      { name: `Discord commands - [${discordprefix}]`, value: '```help, serverinfo, ingameinfo, discordinfo ```' },
     )
    .setImage('https://cdn.discordapp.com/attachments/1076402888307388436/1076857213982888056/ok.png')
    .setTimestamp()
    .setFooter({ text: 'bocchithebridge'});
    if (message.content.startsWith(discordprefix) && message.content.toLowerCase().includes('help')) {
      message.reply({ embeds: [dchelpEmbed] });
      }
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

// Discord commands sit here (a handler soon)
client.on('messageCreate', async message => {
  if (message.author === client.user) {
    return;
  }
  if (channel) {
    const serverinfoEmbed = new EmbedBuilder()
      .setColor("Aqua")
      .setTitle('bocchithebridge - serverinfo')
      .setURL('https://github.com/Thuy2y2c/bocchithebridge')
      .setDescription(`Gives you information about the server "${botArgs.host}:${botArgs.port}"`)
      .addFields(
        { name: `Server address `, value: `\`\`\`${botArgs.host}:${botArgs.port}\`\`\`` },
        { name: `Active players - `, value: `\`\`\`${Object.values(bot.players).map(player => player.username).length} players\`\`\`` },
        { name: `Server current TPS (If bot isn't in the server, TPS will be 0) `, value: `\`\`\`${bot.getTps()} TPS\`\`\`` },
      );

    // Check if the server is hosted locally
    if (botArgs.host === 'localhost') {
      serverinfoEmbed.addFields(
        { name: `Warning! `, value: `\`\`\`Server is hosted locally\`\`\`` }
      );
      serverinfoEmbed.setImage('https://cdn.discordapp.com/attachments/1076402888307388436/1076857213982888056/ok.png');
      message.reply({ embeds: [serverinfoEmbed] });
      return;
    }

    try {
      const response = await fetch(`https://api.mcsrvstat.us/2/${botArgs.host}:${botArgs.port}`);
      if (!response.ok) {
        message.reply(`An error occurred while fetching server information for ${botArgs.host}:${botArgs.port}. (is offline/does not exist?)`);
        return;
      }
      const serverData = await response.json();
      serverinfoEmbed.addFields(
        { name: `Server Version `, value: `\`\`\`${serverData.version}\`\`\`` },
      );
      serverinfoEmbed.setImage(`http://status.mclive.eu/thuy/${botArgs.host}/${botArgs.port}/banner.png`);
      message.reply({ embeds: [serverinfoEmbed] });
    } catch (error) {
      console.error(error);
      message.reply(`An error occurred while fetching server information for ${botArgs.host}:${botArgs.port}. (is offline/does not exist?)`);
    }
  }
});
/* (Why is this seperated from this below one?) My brain can't process enough where to put the server checks in serverinfoEmbed without
it messing with discordinfoEmbed*/
  client.on('messageCreate', message => {
    if (message.author === client.user) {
      return;
    }
    if (channel) {
      const discordinfoEmbed = new EmbedBuilder()
        .setColor("Aqua")
        .setTitle('bocchithebridge - discordinfo')
        .setURL('https://github.com/Thuy2y2c/bocchithebridge')
        .setDescription(`Gives you information about your Discord bot`)
        .addFields(
          { name: `DiscordTag - `, value: `\`\`\`${client.user.tag}\`\`\`` },
          { name: `Bridge Channel - `, value: `${channel} - ${livechat}` },
          { name: `Latency & API Ping(ms) - `, value: `\`\`\`Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms\`\`\`` },
         )
        .setImage('https://cdn.discordapp.com/attachments/1076402888307388436/1076857213982888056/ok.png')
        .setTimestamp()
        .setFooter({ text: 'bocchithebridge'});

      if (message.content.startsWith(discordprefix)) {
        if (message.content.toLowerCase().includes('discordinfo')) {
          message.reply({ embeds: [discordinfoEmbed] });
        }
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
          .setColor("NotQuiteBlack")
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
