const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'ping',
  description: 'a test command',
  execute(message) {

    const dcpingEmbed = new EmbedBuilder()
    .setColor("Aqua")
    .setTitle('bocchithebridge - ping')
    .setURL('https://github.com/Thuy2y2c/bocchithebridge')
    .addFields(
        { name: `Pong! :ping_pong:`, value: `lol this is just a test command lol!!` },
       )
    .setImage('https://cdn.discordapp.com/attachments/1076402888307388436/1076857213982888056/ok.png')
    .setTimestamp()
    .setFooter({ text: 'bocchithebridge'});

    message.channel.send({ embeds : [dcpingEmbed]});
  },
};