const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'server',
  description: 'Check the status of a Minecraft server',
  execute(message, args) {
    if (!args[0]) {
      message.reply('you haven\'t entered the server ip!!! bozo!!');
      return;
    }
    
    const [ip, port = '25565'] = args[0].split(':');
    const url = `http://status.mclive.eu/${message.guild.name}/${ip}/${port}/banner.png`;

    fetch(url)
      .then(res => {
        if (res.ok) {
          const serverEmbed = new EmbedBuilder()
            .setColor("Aqua")
            .setTitle(`Minecraft Server Status: ${ip}:${port}`)
            .setURL('https://github.com/Thuy2y2c/bocchithebridge')
            .setImage(url)
            .setTimestamp()
            .setFooter({ text: 'bocchithebridge'});
          message.channel.send({ embeds: [serverEmbed] });
        } else {
          message.channel.send(`Sorry, I couldn't find a server at ${ip}:${port}`);
        }
      })
      .catch(err => {
        console.error(err);
        message.channel.send(`Sorry, there was an error checking the status of ${ip}:${port}`);
      });
  },
};