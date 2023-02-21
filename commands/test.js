module.exports = {
  name: 'test',
  description: 'a test command',
  execute(message) {
    message.channel.send('whos <@689775193803194398>');
  },
};
