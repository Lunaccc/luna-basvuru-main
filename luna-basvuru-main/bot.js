const Discord = require("discord.js");
const client = new Discord.Client();
const db = require("quick.db")
const ayarlar = require("./ayarlar.json");
const ayar = require("./başvuru.json");
const { Client, Util } = require("discord.js");
const fs = require("fs");
require("./util/eventLoader")(client);
require('discord-buttons')(client);


const log = message => {
  console.log(`${message}`);
};



client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});


client.on('ready', async () => {
client.user.setStatus('online');
console.log(`${client.user.username} ismiyle bağlandım.`);
})




const disbut = require('discord-buttons');
client.on('clickButton', async (button) => {

  const onybuton = new disbut.MessageButton()
    .setLabel('Onaylandı')
    .setStyle('green')
    .setID('ony')
    .setDisabled();

    const onaymsj = new Discord.MessageEmbed()
    .setAuthor('Yılmaz Dev', button.message.guild.iconURL({dynamic: true, type: 'gif', size: 1024}))
    .setDescription(`Başvurunuz Onaylandı ve Yetkili Rolleriniz verildi, Tebrikler :)`)
    .setColor('GREEN');



    const data = await db.get(`basvur.${button.message.id}`)
    if(!data) return;
  const basvuruGonderenID = data;

  if(button.id === 'onay'){
    button.reply.defer()
	const isimdes = client.users.cache.get(basvuruGonderenID);
    await button.message.edit(`<@${basvuruGonderenID}> adlı kişinin, Başvurusu \`${button.clicker.user.tag}\` isimli yetkili tarafından Kabul edildi`, onybuton)
    await client.channels.cache.get(ayar.onayred).send(`<@${basvuruGonderenID}>,`, onaymsj)
    await client.guilds.cache.get(ayar.sunucuid).members.cache.get(basvuruGonderenID).roles.add(ayar.yetkilirolid)
    isimdes.send('Selam Ben YılmazDev Bot \n Başvurun Onaylandı Öncelikle Hoşgeldin \n Ama Tahmin Etmelisinki Bizimde Bazı Kurallarımız Var.\n Bu Kuralları <#780435691557355550> Kanalından Okumalısın\n Ve Sana Görevini Söylüyorum\n\n 1- <#780437763735945226> Kanalına Gelen Şişilere Eyer <#935934913260183642> Kanalını yerine Getirdiyse Abone Rol Vermek \n Peki Bunu Nasıl yapacaksın İşte Böyle Örnek:y!a <kişi> Bu Kadar Basit \n\n 2- Eyer Sunucuda Sesli Ve Yazılı Odalarda Aktif Olursan Daha Hızlı Yetki Yükselirsin :)  \n\n Neyse Şimdiden Kolay Gelsin. xD')
  }
  if(button.id === 'red'){
    button.reply.defer()


    const sorular = [
      '**Reddedilme Sebebi?** <cevap vermek için 3 dakikan var>'
    ]
    let sayac = 0
    
    const filter = m => m.author.id === button.clicker.user.id
    const collector = new Discord.MessageCollector(button.channel, filter, {
      max: sorular.length,
      time: 3000 * 60
    })

    button.channel.send(sorular[sayac++])
    collector.on('collect', m => {
      if(sayac < sorular.length){
        m.channel.send(sorular[sayac++])
      }
    })


    collector.on('end', collected => {
      if(!collected.size) return button.channel.send('**Süre Bitti!**');
      button.channel.send('**Başvurunuz Başarıyla Reddedildi.**');

           
    const redbuton = new disbut.MessageButton()
    .setLabel('Reddedildi')
    .setStyle('red')
    .setID('red')
    .setDisabled();

    const redmsg = new Discord.MessageEmbed()
    .setAuthor('Yılmaz Dev', button.message.guild.iconURL({dynamic: true, type: 'gif', size: 1024}))
    .setDescription(`<@${basvuruGonderenID}> Başvurunuz, \`${collected.map(m => m.content).slice(0,1)}\` nedeniyle ${button.clicker.user} tarafından Reddedildi`)
    .setColor('RED');

     button.message.edit(`<@${basvuruGonderenID}> adlı kişinin, Başvurusu, \`${collected.map(m => m.content).slice(0,1)}\` Sebebiyle, \`${button.clicker.user.tag}\` isimli yetkili tarafından Başarıyla Reddedildi`, redbuton)
     client.channels.cache.get(ayar.onayred).send(`<@${basvuruGonderenID}>,`, redmsg)
          })

    
  }
  db.delete(`basvuru.${button.message.id}`)

});

client.login(ayarlar.token);



