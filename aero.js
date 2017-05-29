const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json');
const prefix = config.prefix;
const token = config.token;

client.on("ready", () => {
  console.log("All systems functional!");
});

client.on("guildMemberAdd", member => {
  let guild = member.guild;
  guild.defaultChannel.send(`Welcome ${member.user} to this server.`);
});

client.on("guildMemberRemove", member => {
  let guild = member.guild;
  guild.defaultChannel.send(`${member.user} has left. Goodbye. :cry:`);
});

client.on("message", message => {

  let modRole = message.guild.roles.find("name", "Moderator");
  let adminRole = message.guild.roles.find("name", "Administrator");
  if (message.author.bot) return;
  let args = message.content.split(" ").slice(1);
  var argresult = args.join(" ");
  var bodylist = ['chest','foot','leg', 'head', 'arm', 'stomach', 'heart'];
  var randomBodyPart = Math.floor(Math.random()*bodylist.length);

  if(message.content === (prefix + "ping")) {
  message.channel.send("Ping?").then(m => m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms.`) );
  }
	if (message.content.startsWith(prefix + "ssay")) {
      message.delete();
         message.channel.send(argresult);
    }

  if(message.content.startsWith(prefix + "shoot")) {
	  if(message.mentions.users.size === 1) {
 	 	message.channel.send(`Shots fired! ${message.mentions.users.first()} has taken a bullet to the ${bodylist[randomBodyPart]}!`);
		if (randomBodyPart === 3) {
			message.channel.send("***Man Down!***")
		}

		if (randomBodyPart === 6) {
			message.channel.send("***Man Down!***");
		}
 	 }
 	 
	  else {
  		message.channel.send("Please mention a single user to shoot.").catch(console.error);
  	}
  }

  if (message.content.startsWith(prefix + "add")) {
      let numArray = args.map(n=> parseInt(n));
      let total = numArray.reduce( (p, c) => p+c);
      message.channel.send(total);
  }

  if(message.content.startsWith(prefix + "clear")) {
    message.delete();
    if(!message.member.roles.has(modRole.id)) {
        return message.channel.send("You are not authorized to use this command. :slight_frown:");
    }
    if(message.member.roles.has(modRole.id)) {
    message.channel.bulkDelete(`${args}`)

    }
    }

    if (message.content.startsWith(prefix + "cage")) {
      if(message.mentions.users.size === 1) {
         message.channel.send(`Bars ready! ${message.mentions.users.first()} has been caged!`);
       } else {
         message.channel.send(`Who do you think you are, trying to cage less or more than one person? :rage: - Try again.`);
       }
    }

    if(message.content.startsWith(prefix + "setgame")) {
      message.delete();
      if(!message.member.roles.has(modRole.id)) return message.channel.send("You are not authorized to use this command. :slight_frown:");
      client.user.setGame(argresult)
    }

    if(message.content.startsWith(prefix + "dm")) {
    message.delete();
    if(!message.member.roles.has(adminRole.id)) return message.channel.send("You are not authorized to use this command. :slight_frown:");
    if(message.mentions.users.size === 1) {
    message.mentions.users.first().send(argresult)
  } else {
    message.channel.send("Please mention a single user to DM.").catch(console.error);
  }
  }


    if(message.content === (prefix + "reboot")) {
      message.delete();
      if (message.author.id !== "217411439948726272")   return;
      process.exit()
    }


    if (message.content.startsWith(prefix + "say")) {
        if(message.member.roles.has(modRole.id)) {
         message.channel.send(argresult);
        } else {
            message.channel.send("You are not authorized to use this command. :slight_frown:").catch(console.error);
        }

    }

    if (message.content.startsWith(prefix + "kick")) {
      message.delete();
        if(!message.member.roles.has(modRole.id)) {
            return message.channel.send("You are not authorized to use this command. :slight_frown:");
        }
        if(message.mentions.users.size === 0) {
            return message.channel.send("Please mention a user to kick.");
        }
        let kickMember = message.guild.member(message.mentions.users.first());
        if (!kickMember) {
            return message.channel.send("That user does not seem valid.");
        }
        if(!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) {
            return message.channel.send("I don't have the permissions (KICK_MEMBER) to do this.")
        }
        kickMember.kick().then(member => {
            message.channel.send(`${member.user.username} was successfully kicked.`)
        }).catch(console.error)
      }

      if (message.content.startsWith(prefix + "ban")) {
          let modRole = message.guild.roles.find("name", "Moderator");
          if(!message.member.roles.has(modRole.id)) {
              return message.channel.send("You are not authorized to use this command. :slight_frown:");
          }
          if(message.mentions.users.size === 0) {
              return message.channel.send("Please mention a user to ban.");
          }
          let banMember = message.guild.member(message.mentions.users.first());
          if (!banMember) {
              return message.channel.send("That user does not seem valid.");
          }
          if(!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) {
              return message.channel.send("I don't have the permissions (BAN_MEMBER) to do this.")
          }
          banMember.ban().then(member => {
              message.channel.send(`${member.user.username} was successfully banned.`)
          }).catch(console.error)
        }

        if (message.content.startsWith(prefix + "unban")) {
            let modRole = message.guild.roles.find("name", "Moderator");
            if(!message.member.roles.has(modRole.id)) {
                return message.channel.send("You are not authorized to use this command. :slight_frown:");
            }

            message.guild.fetchBans().then(member => {
            message.guild.unban(args[0]);
              message.channel.send(`${member.user.username} was successfully unbanned.`)
            }).catch(console.error)
          }

});

client.login(config.token);
