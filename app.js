const Discord = require('discord.js');
const client = new Discord.Client();
const { token, prefix, defcolor } = require('./src/config.json');
const fs = require("fs");

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

fs.readdir("./src/events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      let eventFunction = require(`./src/events/${file}`);
      let eventName = file.split(".")[0];
      client.on(eventName, (...args) => eventFunction.run(client, ...args));
    });
  });
  
  client.on('message', async message => {
    if(message.content.toLowerCase() === `<@${client.user.id}>`){
      const embed = new Discord.MessageEmbed()
      .setTitle(`__Yume's Prefix & Help__`)
      .setDescription([`
      Use \`${prefix}help\` to get all my commands.
      `])
      .setColor(defcolor)
      return message.channel.send(embed);
    }
  });
  
  client.on("message", message => {
    if (message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    try {
      let commandFile = require(`./src/commands/${command}.js`);
      commandFile.run(client, message, args);
    } catch (err) {
    }
  });


client.login(token);