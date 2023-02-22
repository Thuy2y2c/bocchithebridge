const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'help',
  description: 'Gives the user a list of commands.',
  execute(message, prefix, discordprefix, commandNames) {

    const dchelpEmbed = new EmbedBuilder()
    .setColor("Aqua")
    .setTitle('bocchithebridge - ping')
    .setURL('https://github.com/Thuy2y2c/bocchithebridge')
    .addFields(
      { name: `Minecraft commands - [${prefix}]`, value: '```soon ```' },
      { name: `Discord commands - [${discordprefix}]`, value: `\`\`\`${commandNames}\`\`\`` }, // real indeed brainer
     )
    .setImage('https://cdn.discordapp.com/attachments/1076402888307388436/1076857213982888056/ok.png')
    .setTimestamp()
    .setFooter({ text: 'bocchithebridge'});

    message.channel.send({ embeds : [dchelpEmbed]});
  },
};