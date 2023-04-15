const Discord = require("discord.js");
const disbut = require("discord-buttons");
const db = require('quick.db');
const ayarlar = require('../ayarlar.json')
var p = ayarlar.prefix
exports.run = async (client, message, args) => { 
   const embed = new Discord.MessageEmbed()
   .setTitle("Yılmaz Dev Başvuru Botu Yardım Menüsü")
   .addField("Yetkili Başvurusunda bulun",`\`${p}başvur\``)
  .addField("Başvuru sistemini aç/kapat",`\`${p}başvur-durum aç/kapat\``)
  .addField("Başvuramıyacak kişileri engelle",`\`${p}başvur-ban @kişi\``)
   .setThumbnail(client.user.avatarURL({dynamic:true}))
   .setFooter(`${message.author.tag} tarafından istendi`,message.author.avatarURL({dynamic:true,size:1024}));
  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['help','y']
}
exports.help = {
  name: 'yardım'
}